import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ko';
const korean: Record<string, string> = {
 'HOME':'홈','PROJECTS':'프로젝트','MEMBERS':'멤버','EVENTS':'이벤트','CALENDAR':'일정','ABOUT':'소개','EXPLORE':'네트워크',
 "A BAND,":"밴드와","WITH A FEW SIDE PROJECTS.":"몇 가지 딴짓.","EMAIL US ↗":"메일 보내기 ↗",
 "A CREATIVE COLLECTIVE / SINCE 2026":"2026년에 모인 작업 모임",
 'SEOUL ↔ DAEGU ↔ NEW YORK':'서울 ↔ 대구 ↔ 뉴욕',
 "Music, books,":"음악과 책,","and things for the web.":"그리고 웹에서 하는 일들.",
 "SEE OUR WORK":"작업 보기","ABOUT US":"우리 소개",
 "5TH AVE BIPOLAR KIDS":"5TH AVE BIPOLAR KIDS","SEOUL / DAEGU / NEW YORK":"서울 / 대구 / 뉴욕",
 'MUSIC / ART / DESIGN / PUBLISHING / PERFORMANCE':'음악 / 예술 / 디자인 / 출판 / 퍼포먼스',"OUR WORK BELOW ↓":"아래에서 작업 보기 ↓",
 "01 / ABOUT US":"01 / 우리 소개",
 "It started":"처음에는","with a band.":"밴드였습니다.",
 "We got together to play music in 2026. Along the way, people working in design, photography, and writing joined in. Some of us are in Seoul, some in Daegu, some in New York. We work on our own projects and help each other make things.":"2026년, 음악을 하려고 모였습니다. 어쩌다 보니 디자이너, 사진가, 글 쓰는 사람까지 함께하게 됐습니다. 서울, 대구, 뉴욕에 흩어져 각자 작업도 하고, 서로의 작업을 돕기도 합니다.",
 "MEET THE MEMBERS ↗":"멤버 보기 ↗","02 / OUR WORK":"02 / 작업","Things we’ve made.":"만든 것들.",'ALL PROJECTS ↗':'모든 프로젝트 ↗',
 'DIGITAL EXPERIENCE':'디지털 경험','PROJECT ARCHIVE':'프로젝트 아카이브','DIGITAL PUBLICATION':'디지털 출판','INSTITUTION':'커뮤니티',
 "03 / MEMBERS":"03 / 멤버","The people":"같이 만드는","we do this with.":"사람들.","ALL MEMBERS ↗":"멤버 모두 보기 ↗",
 "DATE NOT SET YET":"날짜 미정",'MORE TO COME':'곧 만나요',"Next up.":"다음 모임",
 "Nothing scheduled yet. We’ll post the next event here.":"아직 잡힌 일정은 없습니다. 다음 모임이 정해지면 여기에 올릴게요.","SEE EVENTS ↗":"이벤트 보기 ↗",
 "04 / CONTACT":"04 / 연락처","Want to":"같이","work with us":"작업해볼까요",
 "For projects, collaborations, or a quick hello, send us an email.":"같이 할 작업이 있거나 궁금한 게 있다면 메일 주세요. 가벼운 인사도 좋습니다.",'GET IN TOUCH':'연락하기',"MEMBERS’ WEBSITES ↗":"멤버들의 웹사이트 ↗",
 'VISIT WEBSITE ↗':'웹사이트 방문 ↗','[ CLICK TO VIEW DETAILS ▼ ]':'[ 클릭해서 자세히 보기 ▼ ]','[ CLOSE ]':'[ 닫기 ]','[ ACCESS TERMINAL ]':'[ 관리자 접속 터미널 ]',
 'ACTIVE':'진행 중','ONGOING':'진행 중','COMPLETED':'완료','DORMANT':'휴식 중','CANCELLED':'취소','TBD':'미정','SCHEDULED':'예정','CONFIRMED':'확정','PAST':'종료',
 'Girin University':'기린대학교',"An unofficial school run by the collective. No set curriculum or graduation.":"멤버들이 함께 운영하는 비공식 학교. 정해진 커리큘럼도, 졸업도 없습니다.",
 "A browser game set in Manhattan. Pick Dragon or Unicorn and play for control of the city’s portals.":"맨해튼을 배경으로 한 웹 게임. 드래곤이나 유니콘 팀을 골라 도시의 포털을 차지합니다.",
 "A film magazine turned into a website you can walk around in. Read the articles, look through the films, or stop by the arcade for a quiz.":"영화 매거진을 걸어 다니며 둘러보는 웹사이트로 옮겼습니다. 기사를 읽고, 영화를 찾아보고, 게임방에서 퀴즈도 풀 수 있습니다.",
 "Work from the Fall 2026 JavaScript studio at Parsons, collected in one place.":"파슨스에서 들은 2026년 가을 JavaScript 수업의 작업을 모았습니다.",
 "No date yet. We’ll post the details here.":"날짜는 아직 정해지지 않았습니다. 정해지는 대로 여기에 올릴게요.",'New York City':'뉴욕','Untitled':'제목 미정',
 "ABOUT / 5TH AVE BIPOLAR KIDS":"소개 / 5TH AVE BIPOLAR KIDS",
 "5th Ave Bipolar Kids is a group of people making music, images, books, and websites. We’re based in Seoul, Daegu, and New York.":"5th Ave Bipolar Kids는 음악, 사진과 그림, 책, 웹사이트를 만드는 사람들의 모임입니다. 서울, 대구, 뉴욕에서 함께합니다.",
 "We started as a band in 2026. Somehow, we ended up with more staff than players. There’s still no proper EP, but there is merch. Whether anyone plans to buy or sell it is another question.":"2026년에 밴드로 시작했습니다. 어쩌다 보니 연주자보다 스태프가 많아졌습니다. 제대로 된 EP는 아직 없지만 굿즈는 있습니다. 살 사람도, 팔 생각도 있는지는 모르겠습니다.",
 "Most of us have our own work going on. Sometimes we bring it here and work on it together. That’s how the books, websites, and other projects on this site came about.":"각자 하던 작업을 가져와서 같이 해보기도 합니다. 여기 있는 책, 웹사이트, 여러 프로젝트가 그렇게 나왔습니다.",
 'LOCATION':'활동 지역','FOUNDED':'시작','Seoul / Daegu / New York':'서울 / 대구 / 뉴욕','■ CONTACT // SECURE CHANNEL':'■ 연락하기','EMAIL':'이메일','RESPONSE TIME':'응답 시간','UNKNOWN':'미정',"// PROJECTS, COLLABORATIONS, OR JUST A HELLO":"// 작업 제안, 협업 문의, 가벼운 인사",'■ INSTAGRAM':'■ 인스타그램',
 'CONTACT':'연락처','[ REVEAL ]':'[ 확인하기 ]','POSTER TBD':'포스터 준비 중','IMAGE TBD':'이미지 준비 중',
 'SUN':'일','MON':'월','TUE':'화','WED':'수','THU':'목','FRI':'금','SAT':'토',
 'JAN':'1월','FEB':'2월','MAR':'3월','APR':'4월','MAY':'5월','JUN':'6월','JUL':'7월','AUG':'8월','SEP':'9월','OCT':'10월','NOV':'11월','DEC':'12월',
 'FORMAT':'형식','ACTIVITIES':'활동','STATUS':'상태','Always active':'언제나 활동 중','All members of 5th Ave Bipolar Kids':'5th Ave Bipolar Kids의 모든 멤버','An informal collective school — no curriculum, no attendance, no graduation':'정해진 커리큘럼도, 출석도, 졸업도 없는 비공식 컬렉티브 학교','Book clubs, film screenings, listening parties, and occasional sessions':'북클럽, 영화 상영, 음악 감상회, 그리고 비정기 세션',
 '// CALENDAR':'// 일정','// CLICK A DATE TO ADD AN ENTRY · CLICK AN ENTRY TO EDIT OR DELETE':'// 날짜를 눌러 일정 추가 · 일정을 눌러 수정 또는 삭제',
 'PRODUCER / DESIGNER':'프로듀서 / 디자이너','CREATIVE DIRECTOR':'크리에이티브 디렉터','DESIGNER':'디자이너','HUMAN':'사람','FASHION PHOTOGRAPHER':'패션 사진가','SCIENTIST':'과학자','SAMPLER / SOUND DESIGNER':'샘플러 / 사운드 디자이너','MANAGER / STRATEGIST':'매니저 / 전략가','WRITER':'작가','PRODUCER / ENGINEER':'프로듀서 / 엔지니어','STYLIST / ART DIRECTOR':'스타일리스트 / 아트 디렉터','CHEERLEADER':'응원단장','LISTENER':'리스너',
 'TODAY':'오늘','No events scheduled.':'등록된 일정이 없습니다.','Saving to server…':'서버에 저장 중…',
 '[ ADMIN LOGIN ]':'[ 관리자 로그인 ]','ADMIN CODE':'관리자 코드','SIGN IN':'로그인','SIGNING IN…':'로그인 중…','[ ADMIN · SIGN OUT ]':'[ 관리자 · 로그아웃 ]',
};
const copyUpdates: Record<string, string> = {
  "An unaccredited educational institution. No curriculum provided.": "An unofficial school run by the collective. No set curriculum or graduation.",
  "Two legends collide beneath Manhattan. Choose your side and battle for control of the portals.": "A browser game set in Manhattan. Pick Dragon or Unicorn and play for control of the city’s portals.",
  "A film magazine made to be shared. Explore stories, screenings, and quizzes in an interactive cinema. Watch. Talk. Pass it on.": "A film magazine turned into a website you can walk around in. Read the articles, look through the films, or stop by the arcade for a quiz.",
  "A Fall 2026 project archive from Parsons School of Design. Experiments in JavaScript, interaction, and creative coding.": "Work from the Fall 2026 JavaScript studio at Parsons, collected in one place.",
  "Date and details to be announced.": "No date yet. We’ll post the details here."
};
const Context = createContext<{language: Language; setLanguage: (v: Language) => void; t: (text: string) => string}>({language:'en',setLanguage:()=>{},t:text=>text});
export function LanguageProvider({children}: {children: React.ReactNode}) {
 const [language,setLanguage] = useState<Language>(()=>{try{return localStorage.getItem('bipolar-language')==='ko'?'ko':'en'}catch{return 'en'}});
 useEffect(()=>{document.documentElement.lang=language;try{localStorage.setItem('bipolar-language',language)}catch{}},[language]);
 const t=useCallback((text:string)=>{const normalized=text.replace(/\s+/g,' ').trim();const copy=copyUpdates[normalized]??normalized;return language==='ko'?(korean[copy]??text):(copyUpdates[normalized]??text)},[language]);
 return <Context.Provider value={{language,setLanguage,t}}>{children}</Context.Provider>;
}
export const useLanguage=()=>useContext(Context);
