import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

type Language = 'en' | 'ko';
const korean: Record<string, string> = {
 'HOME':'홈','PROJECTS':'프로젝트','MEMBERS':'멤버','EVENTS':'이벤트','CALENDAR':'일정','ABOUT':'소개','EXPLORE':'네트워크',
 'INDEPENDENT MINDS.':'독립적인 생각들.','CONNECTED FREQUENCIES.':'하나로 이어지는 주파수.','LET’S TALK ↗':'함께 이야기해요 ↗',
 'INDEPENDENT CREATIVE COLLECTIVE / EST. 2026':'독립 크리에이티브 컬렉티브 / 2026년 시작',
 'SEOUL ↔ DAEGU ↔ NEW YORK':'서울 ↔ 대구 ↔ 뉴욕',
 'Different minds.':'서로 다른 생각들.','One collective frequency.':'하나의 컬렉티브 주파수.',
 'EXPLORE OUR WORK':'프로젝트 살펴보기','MEET THE COLLECTIVE':'컬렉티브 소개',
 'INDEPENDENT BY NATURE.':'자유롭게 생각하고.','CONNECTED BY CHOICE.':'함께하기를 선택합니다.',
 'MUSIC / ART / DESIGN / PUBLISHING / PERFORMANCE':'음악 / 예술 / 디자인 / 출판 / 퍼포먼스','SCROLL TO DISCOVER ↓':'아래로 둘러보기 ↓',
 '01 / WHO WE ARE':'01 / 우리는 누구인가',
 'A shared space for':'경계를 넘나드는','ideas that cross boundaries.':'생각이 모이는 곳.',
 'We started as a band. Now, we bring together musicians, designers, artists, and writers across Seoul, Daegu, and New York. From independent publications to digital experiments, we make room for different ways of creating.':'우리는 밴드로 시작했습니다. 지금은 서울, 대구, 뉴욕의 음악가, 디자이너, 예술가, 작가가 함께합니다. 독립 출판부터 디지털 실험까지, 서로 다른 방식의 창작이 만나는 공간을 만들어갑니다.',
 'MEET OUR PEOPLE ↗':'멤버 만나보기 ↗','02 / SELECTED WORK':'02 / 주요 프로젝트','Made by the collective.':'우리가 함께 만든 것들.','ALL PROJECTS ↗':'모든 프로젝트 ↗',
 'DIGITAL EXPERIENCE':'디지털 경험','PROJECT ARCHIVE':'프로젝트 아카이브','DIGITAL PUBLICATION':'디지털 출판','INSTITUTION':'커뮤니티',
 '03 / THE PEOPLE BEHIND IT':'03 / 함께하는 사람들','Many voices.':'다양한 목소리.','Shared energy.':'함께 만드는 에너지.','DISCOVER THE FULL CREW ↗':'모든 멤버 보기 ↗',
 'ON OUR RADAR / EVENTS':'다가올 만남 / 이벤트','DATE TO BE ANNOUNCED':'일정 추후 공개','MORE TO COME':'곧 만나요','The next gathering.':'다음 만남을 준비합니다.',
 'Keep an eye on this space for our next collective gathering.':'컬렉티브의 다음 모임 소식을 이곳에서 확인하세요.','EVENTS & GATHERINGS ↗':'이벤트와 모임 보기 ↗',
 '04 / KEEP THE CONVERSATION GOING':'04 / 대화를 이어가요','Have something':'함께 만들고 싶은','in mind':'무언가가 있나요',
 'Collaborations, new ideas, and everything in between.':'협업, 새로운 아이디어, 그 사이의 모든 이야기를 기다립니다.','GET IN TOUCH':'연락하기','OUR CREATIVE NETWORK ↗':'우리의 크리에이티브 네트워크 ↗',
 'VISIT WEBSITE ↗':'웹사이트 방문 ↗','[ CLICK TO VIEW DETAILS ▼ ]':'[ 클릭해서 자세히 보기 ▼ ]','[ CLOSE ]':'[ 닫기 ]','[ ACCESS TERMINAL ]':'[ 관리자 접속 터미널 ]',
 'ACTIVE':'진행 중','ONGOING':'진행 중','COMPLETED':'완료','DORMANT':'휴식 중','CANCELLED':'취소','TBD':'미정','SCHEDULED':'예정','CONFIRMED':'확정','PAST':'종료',
 'Girin University':'기린대학교','An unaccredited educational institution. No curriculum provided.':'인가받지 않은 교육기관. 정해진 커리큘럼은 없습니다.',
 'Two legends collide beneath Manhattan. Choose your side and battle for control of the portals.':'맨해튼 지하에서 두 전설이 맞붙습니다. 진영을 선택하고 포털을 차지하기 위한 대결에 참여하세요.',
 'A film magazine made to be shared. Explore stories, screenings, and quizzes in an interactive cinema. Watch. Talk. Pass it on.':'함께 나누는 영화 매거진. 인터랙티브 영화관에서 이야기와 상영작, 퀴즈를 만나보세요. 보고, 이야기하고, 나누세요.',
 'A Fall 2026 project archive from Parsons School of Design. Experiments in JavaScript, interaction, and creative coding.':'파슨스 디자인 스쿨의 2026년 가을 프로젝트 아카이브. 자바스크립트, 인터랙션, 크리에이티브 코딩을 실험합니다.',
 'Date and details to be announced.':'일정과 자세한 내용은 추후 공개됩니다.','New York City':'뉴욕','Untitled':'제목 미정',
 'ENTITY // COLLECTIVE':'우리의 정체성 // 컬렉티브',
 '5th Ave Bipolar Kids is an underground creative collective based in Seoul, Daegu, and New York. We work across music, visual art, writing, design, and performance, crossing boundaries between genres.':'5th Ave Bipolar Kids는 서울, 대구, 뉴욕을 기반으로 활동하는 언더그라운드 크리에이티브 컬렉티브입니다. 음악, 시각 예술, 글, 디자인, 퍼포먼스를 넘나들며 장르의 경계를 확장합니다.',
 'Founded as a band in 2026, we somehow ended up with more staff than musicians, thanks to low participation and a shortage of instrumentalists. Three months in, we still have no proper EP, and the staff still outnumber the players. We keep making merch with no buyers, and the sellers have no intention of selling it either.':'2026년 밴드로 시작했지만, 참여율과 연주자 부족으로 어느새 음악가보다 스태프가 더 많아졌습니다. 세 달이 지나도 제대로 된 EP는 없고, 여전히 연주자보다 스태프가 많습니다. 살 사람 없는 굿즈를 만들고, 파는 사람도 팔 생각이 없습니다.',
 'Still, we keep going. Starting from our identity as a band, 5th Ave Bipolar Kids is growing into an arts community spanning music, visual art, design, publishing, and performance.':'그래도 우리는 계속합니다. 밴드라는 정체성에서 출발한 5th Ave Bipolar Kids는 음악, 시각 예술, 디자인, 출판, 퍼포먼스를 아우르는 예술 커뮤니티로 성장하고 있습니다.',
 'LOCATION':'활동 지역','FOUNDED':'시작','Seoul / Daegu / New York':'서울 / 대구 / 뉴욕','■ CONTACT // SECURE CHANNEL':'■ 연락하기','EMAIL':'이메일','RESPONSE TIME':'응답 시간','UNKNOWN':'미정','// BUSINESS INQUIRIES, COLLABORATIONS, AND EVERYTHING ELSE':'// 비즈니스 문의, 협업, 그리고 모든 이야기','■ INSTAGRAM':'■ 인스타그램',
 'CONTACT':'연락처','[ REVEAL ]':'[ 확인하기 ]','POSTER TBD':'포스터 준비 중','IMAGE TBD':'이미지 준비 중',
 'SUN':'일','MON':'월','TUE':'화','WED':'수','THU':'목','FRI':'금','SAT':'토',
 'JAN':'1월','FEB':'2월','MAR':'3월','APR':'4월','MAY':'5월','JUN':'6월','JUL':'7월','AUG':'8월','SEP':'9월','OCT':'10월','NOV':'11월','DEC':'12월',
 'FORMAT':'형식','ACTIVITIES':'활동','STATUS':'상태','Always active':'언제나 활동 중','All members of 5th Ave Bipolar Kids':'5th Ave Bipolar Kids의 모든 멤버','An informal collective school — no curriculum, no attendance, no graduation':'정해진 커리큘럼도, 출석도, 졸업도 없는 비공식 컬렉티브 학교','Book clubs, film screenings, listening parties, and occasional sessions':'북클럽, 영화 상영, 음악 감상회, 그리고 비정기 세션',
 '// CALENDAR':'// 일정','// CLICK A DATE TO ADD AN ENTRY · CLICK AN ENTRY TO EDIT OR DELETE':'// 날짜를 눌러 일정 추가 · 일정을 눌러 수정 또는 삭제',
 'PRODUCER / DESIGNER':'프로듀서 / 디자이너','CREATIVE DIRECTOR':'크리에이티브 디렉터','DESIGNER':'디자이너','HUMAN':'사람','FASHION PHOTOGRAPHER':'패션 사진가','SCIENTIST':'과학자','SAMPLER / SOUND DESIGNER':'샘플러 / 사운드 디자이너','MANAGER / STRATEGIST':'매니저 / 전략가','WRITER':'작가','PRODUCER / ENGINEER':'프로듀서 / 엔지니어','STYLIST / ART DIRECTOR':'스타일리스트 / 아트 디렉터','CHEERLEADER':'응원단장','LISTENER':'리스너',
 'TODAY':'오늘','No events scheduled.':'등록된 일정이 없습니다.','Saving to server…':'서버에 저장 중…',
 '[ ADMIN LOGIN ]':'[ 관리자 로그인 ]','ADMIN CODE':'관리자 코드','SIGN IN':'로그인','SIGNING IN…':'로그인 중…','[ ADMIN · SIGN OUT ]':'[ 관리자 · 로그아웃 ]',
};
const Context = createContext<{language: Language; setLanguage: (v: Language) => void; t: (text: string) => string}>({language:'en',setLanguage:()=>{},t:text=>text});
export function LanguageProvider({children}: {children: React.ReactNode}) {
 const [language,setLanguage] = useState<Language>(()=>{try{return localStorage.getItem('bipolar-language')==='ko'?'ko':'en'}catch{return 'en'}});
 useEffect(()=>{document.documentElement.lang=language;try{localStorage.setItem('bipolar-language',language)}catch{}},[language]);
 const t=useCallback((text:string)=>language==='ko'?(korean[text.replace(/\s+/g,' ').trim()]??text):text,[language]);
 return <Context.Provider value={{language,setLanguage,t}}>{children}</Context.Provider>;
}
export const useLanguage=()=>useContext(Context);
