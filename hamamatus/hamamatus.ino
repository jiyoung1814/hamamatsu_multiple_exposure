#define SPEC_TRG         A0
#define SPEC_ST          A1
#define SPEC_CLK         A2
#define SPEC_VIDEO       A3
#define WHITE_LED        A4
#define LASER_404        A5

#define MY_DEVICE_ID        1
#define SPEC_CHANNELS    288
int data[SPEC_CHANNELS];
float dark_current = 0;
int battery = 0;

byte STX;
byte DEVID;
byte CMD;
long DATA1;
long DATA2;
byte FLAGS[SPEC_CHANNELS] = {0}; //mutiple exposure 측정 pixel flag
//byte yourCHECKSUM;
//byte myCHECKSUM;
//long CHECKSUM;
byte ETX;



/*
   Bluetooth Terminal 로 테스트 시 아래의 패킷을 사용
   SPD 요청 :
   Auto Integration Time 요청 :
*/
void setup() {
  pinMode(SPEC_CLK, OUTPUT);
  pinMode(SPEC_ST, OUTPUT);
  pinMode(LASER_404, OUTPUT);
  pinMode(WHITE_LED, OUTPUT);

  digitalWrite(SPEC_CLK, HIGH); // Set SPEC_CLK High
  digitalWrite(SPEC_ST, LOW); // Set SPEC_ST Low

  initValues();

  Serial.begin(9600);
}

void measureLightSource(long integration_time) {
  int DELAY = 1;

  digitalWrite(SPEC_CLK, HIGH);
  digitalWrite(SPEC_ST, HIGH);
  delayMicroseconds(DELAY);

  for (long i = 0; i < integration_time; i++)
  {
    digitalWrite(SPEC_CLK, LOW);
    delayMicroseconds(DELAY);
    digitalWrite(SPEC_CLK, HIGH);
    delayMicroseconds(DELAY);
  }

  digitalWrite(SPEC_ST, LOW);

  for (int i = 0; i < 88; i++)
  {
    digitalWrite(SPEC_CLK, LOW);
    delayMicroseconds(DELAY);
    digitalWrite(SPEC_CLK, HIGH);
    delayMicroseconds(DELAY);
  }

  for (int i = 0; i < SPEC_CHANNELS; i++)
  {
    data[i] = analogRead(SPEC_VIDEO);
    digitalWrite(SPEC_CLK, LOW);
    delayMicroseconds(DELAY);
    digitalWrite(SPEC_CLK, HIGH);
    delayMicroseconds(DELAY);
  }
}

void removeDarkCurrunt(long integration_time) {
//  dark_current = 1.092222E+02;
//  dark_current += 1.844588E-04 * integration_time;
//  dark_current += (-9.724963E-11 * integration_time) * integration_time;
//  dark_current += ((1.198584E-15 * integration_time) * integration_time) * integration_time;
//  dark_current += (((-1.589876E-21 * integration_time) * integration_time) * integration_time) * integration_time;
//  dark_current += ((((6.454925E-28 * integration_time) * integration_time) * integration_time) * integration_time) * integration_time;
//  for (int i = 0; i < SPEC_CHANNELS; i++)
//  {
//    // 암전류 제거
//    data[i] = (int) abs(data[i] - dark_current);
//  }
}

long autoIntegrationTime(long integration_time, int saturation) {
  long inttime = integration_time;

  int pct = saturation;

//  saturation (10~100) => Percentageization
  if(pct <10){
    pct = 10;
  }
  else if(pct > 100){
    pct = 100;
  }

  float persentage = float(pct)/100.0;
  float MAX = 1023*persentage;
  float MIN = 1023*(persentage-0.1);

  while (1)
  {
    if (!(inttime > 10 && inttime <= 1000000)) break;
    measureLightSource(inttime);
    int max = data[0];  // 가장 큰 값이...
    for (int i = 0; i < 288; i++)
      if (max < data[i] && !FLAGS[i])
        max = data[i];

    if (max < MIN) {  // (saturation-10)% 보다 작으면 1.05배...
      inttime *= 1.05;
    } else if (max > MAX) { // saturation% 보다 크면 0.95배...
      inttime *= 0.95;
    } else {    // 850~900 사이라면 break...
      break;
    }
  }
  return inttime;
}

/*
   11 바이트를 수신하고
   파싱하여 전역변수에 저장하고 (노출시간이 정상범위가 아니라면 1000으로 설정)
   정상 패킷인지 아닌지 확인하여 true 혹은 false를 반환
*/
boolean readPacket() {
  if (Serial.available())
  {
    char receive[298];
//    byte receiveCnt;
//    byte receiveCnt = Serial.readBytes(receive, 300);
    int receiveCnt = Serial.readBytes(receive, 298);
    if (receiveCnt == 10 || receiveCnt == 298 || receiveCnt == 296)
    {
//      Serial.println("sssss");
      // 정상 패킷 길이 확인
      byte stx = receive[0];
      byte devid = receive[1];
      byte cmd = receive[2];
      long data1 = (((long)receive[3] & 0xFF) << 24) + (((long)receive[4] & 0xFF) << 16) + (((long)receive[5] & 0xFF) << 8) + ((long)receive[6] & 0xFF);
      long data2 = (((int)receive[7] & 0xFF) << 8) + ((int)receive[8] & 0xFF);
//      byte yourchecksum = receive[9];
//      byte mychecksum = (byte) ~((byte) (receive[3] + receive[4] + receive[5] + receive[6] + receive[7] + receive[8]));
//      long checksum = yourchecksum - mychecksum;
//      byte etx = receive[10];
      byte etx;
//      int flags[288];

      if (receiveCnt == 10){
        etx = receive[9];
      }
      else{
        for(int i=0;i<(SPEC_CHANNELS/2); i++){
          FLAGS[i] = receive[i+9];
        }
        etx = receive[297];
      }

      if (!(data1 >= 11 && data1 <= 1000000))
      {
        data1 = 1000;  // integration time 이 11 ~ 1000000이 아니라면 1000으로 셋팅
      }

      if (stx == 0x02 && etx == 0x03 && devid == MY_DEVICE_ID)
      {
        // 정상 패킷이라면
        STX = stx;
        DEVID = devid;
        CMD = cmd;
        DATA1 = data1;
        DATA2 = data2;
//        yourCHECKSUM = yourchecksum;
//        myCHECKSUM = mychecksum;
//        CHECKSUM = checksum;
//        FLAGS = flags;
        ETX = etx;
        return true;
      }
    }
  }
  return false;
}

void writePacket(char cmd, long integration_time) {
  byte buffer[585];
//  long check_sum = 0;
  buffer[0] = 0x02;
  buffer[1] = MY_DEVICE_ID;
  buffer[2] = cmd;
  buffer[3] = (integration_time >> 24) & 0xFF;
  buffer[4] = (integration_time >> 16) & 0xFF;
  buffer[5] = (integration_time >> 8) & 0xFF;
  buffer[6] = integration_time & 0xFF;
  for (int i = 0; i < SPEC_CHANNELS; i++)
  {
    buffer[2 * i + 7] = (data[i] >> 8) & 0xFF;
    buffer[2 * i + 8] = data[i] & 0xFF;
//    check_sum += buffer[2 * i + 7] + buffer[2 * i + 8];
  }
//  buffer[583] = (byte) ~((byte) check_sum);
  buffer[583] = DATA2 & 0xFF;
  buffer[584] = 0x03;
  Serial.write(buffer, 585);
}

void initValues() {
  STX = 0;
  DEVID = 0;
  CMD = 0;
  DATA1 = 0;
  DATA2 = 0;
//  FLAG = {0}
//  yourCHECKSUM = 0;
//  myCHECKSUM = 0;
//  CHECKSUM = 0;
  ETX = 0;
  for(int i=0;i<SPEC_CHANNELS;i++){
    FLAGS[i] = 0;
  }
}

void loop() {
  if (readPacket())
  {
    if (CMD == 'A' || CMD == 'R')         // 노출시간 자동, 암전류 자동 (R: 다중노출)
    {
      long inttime = autoIntegrationTime(DATA1, DATA2);
      removeDarkCurrunt(inttime);
      if(CMD == 'A'){writePacket('a', inttime);}
      else{writePacket('r', inttime);}
      
    }
    else if (CMD == 'M')    // 노출시간 수동, 암전류 자동
    {
      long inttime = DATA1;
      measureLightSource(inttime);
      removeDarkCurrunt(inttime);
      writePacket('m', inttime);
    }
    else if (CMD == 'S')    // 노출시간 수동, 암전류 수동
    {
      long inttime = DATA1;
      measureLightSource(inttime);
      writePacket('s', inttime);
    }
    else if (CMD == 'W')    // LED ON OFF : W (White)
    {
      byte onoff = DATA2;
      if (onoff)   // true 라면 LED on
        digitalWrite(WHITE_LED, HIGH);
      else       // false 라면 LED off
        digitalWrite(WHITE_LED, LOW);
    }
    else if (CMD == 'V')    // LASER ON OFF : V (Violet)
    {
      byte onoff = DATA2;
      if (onoff)   // true 라면 LASER on
        digitalWrite(LASER_404, HIGH);
      else       // false 라면 LASER off
        digitalWrite(LASER_404, LOW);
    }
    initValues();
  }
}
