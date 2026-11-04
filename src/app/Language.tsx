import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ko';
const korean: Record<string, string> = {
 'SPANKY is an underwear brand presented by 5th Ave Bipolar Kids.':'SPANKY는 5th Ave Bipolar Kids가 선보이는 언더웨어 브랜드입니다.',
 'UNDERWEAR BRAND':'언더웨어 브랜드','FEATURED PROJECT':'대표 프로젝트','DISCOVER SPANKY':'SPANKY 만나보기','VISIT SPANKY ↗':'SPANKY 웹사이트 ↗','PRESENTED BY':'선보이는 곳','CATEGORY':'분야','Underwear':'언더웨어','PRESENTED BY 5TH AVE BIPOLAR KIDS':'5TH AVE BIPOLAR KIDS가 선보입니다','SPANKY underwear collection':'SPANKY 언더웨어 컬렉션',

 'HOME':'홈','PROJECTS':'프로젝트','MEMBERS':'멤버','EVENTS':'이벤트','CALENDAR':'일정','ABOUT':'소개','EXPLORE':'네트워크',
 "A BAND":"밴드에서 시작한","AND A CREATIVE COLLECTIVE.":"크리에이티브 컬렉티브.","EMAIL US ↗":"메일 보내기 ↗",
 "A CREATIVE COLLECTIVE / EST. 2026":"크리에이티브 컬렉티브 / 2026년 시작",
 'SEOUL ↔ DAEGU ↔ NEW YORK':'서울 ↔ 대구 ↔ 뉴욕',
 "Music, books,":"음악과 책,","and websites.":"그리고 웹사이트.",
 "VIEW PROJECTS":"프로젝트 보기","ABOUT US":"우리 소개",
 "5TH AVE BIPOLAR KIDS":"5TH AVE BIPOLAR KIDS","SEOUL / DAEGU / NEW YORK":"서울 / 대구 / 뉴욕",
 'MUSIC / ART / DESIGN / PUBLISHING / PERFORMANCE':'음악 / 예술 / 디자인 / 출판 / 퍼포먼스',"VIEW PROJECTS ↓":"프로젝트 보기 ↓",
 "01 / ABOUT US":"01 / 우리 소개",
 "It started":"시작은","with a band.":"밴드였습니다.",
 "5th Ave Bipolar Kids began as a band in 2026. Our members work in music, design, photography, and writing across Seoul, Daegu, and New York. The projects here include both individual work and collaborations.":"2026년, 5th Ave Bipolar Kids는 밴드로 시작했습니다.\n지금 우리는, 서울, 대구, 뉴욕에서 모인 '뮤지션', '디자이너', '포토그래퍼', '작가'와 함께 활동합니다.\n이 곳에서는, 5th Ave Bipolar Kids의 프로젝트들을 선보입니다.",
 "VIEW MEMBERS ↗":"멤버 보기 ↗","02 / OUR WORK":"02 / 작업","Our projects.":"프로젝트",'ALL PROJECTS ↗':'모든 프로젝트 ↗',
 'DIGITAL EXPERIENCE':'디지털 경험','PROJECT ARCHIVE':'프로젝트 아카이브','DIGITAL PUBLICATION':'디지털 출판','INSTITUTION':'커뮤니티',
 "03 / MEMBERS":"03 / 멤버","Our members.":"함께하는 멤버들","ALL MEMBERS ↗":"전체 멤버 보기 ↗",
 "DATE TO BE ANNOUNCED":"일정 추후 안내","FURTHER DETAILS TO FOLLOW":"추후 안내","Next up.":"다음 모임",
 "No upcoming events are listed.":"현재 예정된 이벤트가 없습니다.","SEE EVENTS ↗":"이벤트 보기 ↗",
 "04 / CONTACT":"04 / 연락처","Projects and":"작업 제안과","collaborations.":"협업 문의",
 "For project enquiries and collaboration proposals, email us at ddoazoo@gmail.com.":"프로젝트와 협업 문의는 ddoazoo@gmail.com으로 보내주세요.","EMAIL US":"메일 보내기","RELATED WEBSITES ↗":"관련 웹사이트 ↗",
 'VISIT WEBSITE ↗':'웹사이트 방문 ↗',"[ VIEW DETAILS ▼ ]":"[ 자세히 보기 ▼ ]",'[ CLOSE ]':'[ 닫기 ]','[ ACCESS TERMINAL ]':'[ 관리자 접속 터미널 ]',
 'ACTIVE':'진행 중','ONGOING':'진행 중','COMPLETED':'완료','DORMANT':'휴식 중','CANCELLED':'취소','TBD':'미정','SCHEDULED':'예정','CONFIRMED':'확정','PAST':'종료',
 'Girin University':'기린대학교',"An informal school run by the collective, without a fixed curriculum or graduation.":"커리큘럼 없음. 학사 경고 없음. 졸업 없음.\n멤버들이 함께 운영하는 비공식 대학교입니다.",
 "A browser game set in Manhattan, where Dragon and Unicorn teams compete for the city’s portals.":"맨해튼의 포털을 두고 드래곤과 유니콘 팀이 맞붙는 웹 게임입니다.",
 "An online film magazine presented as an interactive cinema, with articles, film selections, and quizzes.":"\"영화관을 읽다.\" 무비 칼럼, 영화 소개와 영화 퀴즈를 담은 온라인 무비 매거진입니다.",
 "A collection of projects from the Fall 2026 JavaScript studio at Parsons School of Design.":"파슨스 디자인 스쿨의 2026년 가을 JavaScript 스튜디오 수업에서 만든 작업을 모았습니다.",
 "Date and venue will be announced here.":"일정과 장소는 확정되는 대로 안내합니다.",'New York City':'뉴욕','Untitled':'제목 미정',
 "ABOUT / 5TH AVE BIPOLAR KIDS":"소개 / 5TH AVE BIPOLAR KIDS",
 "5th Ave Bipolar Kids is a collective of musicians, designers, photographers, and writers in Seoul, Daegu, and New York.":"5th Ave Bipolar Kids는 서울, 대구, 뉴욕의 뮤지션, 디자이너, 포토그래퍼, 작가가 모인 컬렉티브입니다.",
 "We formed as a band in 2026. As more members joined, our work grew to include publications, websites, and other projects.":"2026년 밴드로 출발한 뒤, 여러 분야의 멤버들이 합류하면서 책과 웹사이트 등으로 작업을 넓혀왔습니다.",
 "This site brings together our projects, the members behind them, and upcoming events.":"이곳에서 멤버들의 작업과 컬렉티브의 프로젝트, 앞으로의 모임을 소개합니다.",
 'LOCATION':'활동 지역','FOUNDED':'활동 시작','Seoul / Daegu / New York':'서울 / 대구 / 뉴욕',"■ CONTACT":"■ 연락처",'EMAIL':'이메일',"// PROJECT ENQUIRIES & COLLABORATIONS":"// 프로젝트 제안 및 협업 문의",'■ INSTAGRAM':'■ 인스타그램',
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
  "An unaccredited educational institution. No curriculum provided.": "An informal school run by the collective, without a fixed curriculum or graduation.",
  "Two legends collide beneath Manhattan. Choose your side and battle for control of the portals.": "A browser game set in Manhattan, where Dragon and Unicorn teams compete for the city’s portals.",
  "A film magazine made to be shared. Explore stories, screenings, and quizzes in an interactive cinema. Watch. Talk. Pass it on.": "An online film magazine presented as an interactive cinema, with articles, film selections, and quizzes.",
  "A Fall 2026 project archive from Parsons School of Design. Experiments in JavaScript, interaction, and creative coding.": "A collection of projects from the Fall 2026 JavaScript studio at Parsons School of Design.",
  "Date and details to be announced.": "Date and venue will be announced here.",
  "An unofficial school run by the collective. No set curriculum or graduation.": "An informal school run by the collective, without a fixed curriculum or graduation.",
  "A browser game set in Manhattan. Pick Dragon or Unicorn and play for control of the city’s portals.": "A browser game set in Manhattan, where Dragon and Unicorn teams compete for the city’s portals.",
  "A film magazine turned into a website you can walk around in. Read the articles, look through the films, or stop by the arcade for a quiz.": "An online film magazine presented as an interactive cinema, with articles, film selections, and quizzes.",
  "Work from the Fall 2026 JavaScript studio at Parsons, collected in one place.": "A collection of projects from the Fall 2026 JavaScript studio at Parsons School of Design.",
  "No date yet. We’ll post the details here.": "Date and venue will be announced here."
};
const Context = createContext<{language: Language; setLanguage: (v: Language) => void; t: (text: string) => string}>({language:'en',setLanguage:()=>{},t:text=>text});
export function LanguageProvider({children}: {children: React.ReactNode}) {
 const [language,setLanguage] = useState<Language>(()=>{try{return localStorage.getItem('bipolar-language')==='ko'?'ko':'en'}catch{return 'en'}});
 useEffect(()=>{document.documentElement.lang=language;try{localStorage.setItem('bipolar-language',language)}catch{}},[language]);
 const t=useCallback((text:string)=>{const normalized=text.replace(/\s+/g,' ').trim();const copy=copyUpdates[normalized]??normalized;return language==='ko'?(korean[copy]??text):(copyUpdates[normalized]??text)},[language]);
 return <Context.Provider value={{language,setLanguage,t}}>{children}</Context.Provider>;
}
export const useLanguage=()=>useContext(Context);
