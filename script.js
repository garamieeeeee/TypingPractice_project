//타자연습 할 문장들
const sentences = [
    "Hello",
    "This is my first project",
    "please play with fun",
    "see you next time",
    "bye"
];

//객체들 불러오기 & 세팅
const prev = document.getElementById("prev");
const cur = document.getElementById("cur");
const next = document.getElementById("next");
const inputBox = document.getElementById("inputBox")
inputBox.onpaste = (e) => { ///inputBox에 붙여넣기 방지
    e.preventDefault();
    return false;
}
inputBox.disabled = true;
const timer = document.getElementById("timer");
const info = document.getElementById("info");
const pauseButton = document.getElementById("pauseButton");

let current_sentenceIndex = 0;
cur.textContent = sentences[current_sentenceIndex];
next.textContent = sentences[current_sentenceIndex+1];
let isGaming = false;

//타이머 변수
let timerId = "";
let m = 0;
let s = 0;

// //게임 종료 등 메시지를 출력하는 박스
const messageBox = document.getElementById("messageBox");
const notice = document.getElementById("notice");
const messageContent = document.getElementById("messageContent");
const buttonsBox = document.getElementById("buttonsBox");
const user_log = document.getElementById("user_log");

//게임을 일시 정지했을때 messageBox에 뜨는 세가지 버튼(그만하기/계속하기/다시시작)
const continueButton = document.getElementById("continueButton");
const quitButton = document.getElementById("quitButton");
const restartButton = document.getElementById("restartButton");

//진행도 & 타자수 & 정확도 계산
const vol = document.getElementById("vol");
const cor = document.getElementById("cor");
const pro = document.getElementById("pro");
let total_KeyInput = 0;
let total_seconds = 0;
let total_correctInput = 0; //사용자가 입력한 글자 중 정확한 글자 수
let total_charcters = 0;
pro.textContent = `0/${sentences.length}`;
vol.textContent = total_KeyInput;
cor.textContent = `${total_correctInput}%`;

//바 관련(progress: 진행도, volume: 현재 타자수, correct: 정확도)
const proBar = document.getElementById("proBar");
const volBar = document.getElementById("volBar");
const corBar = document.getElementById("corBar");
let w1 = 0;

function calculateWidth(){//문장들의 현재 진행도를 계산해주는 함수
    let entirety = sentences.length;
    let current_portion = current_sentenceIndex+1;
    let proportion = (current_portion / entirety)*100;
    return proportion;
}

function update_proBar(){//현재 진행도에 따라 프로그레스바를 갱신해주는 함수
    w1 = calculateWidth();
    if(w1 <= 100){
        proBar.style.width = w1+"%";
        pro.textContent = `${current_sentenceIndex+1}/${sentences.length}`;
    }
}

function update_volBar(){ //현재 타수를 막대로 표시해주는 함수(최대:500)
    volBar.style.width = (total_KeyInput / 500)*100+"%";
}

function update_corBar(){ //지금까지 입력한 문장들의 정확도를 막대로 표시해주는 함수
    corBar.style.width = (total_correctInput/total_charcters)*100+"%";
}

//타이머 관련 함수
function format_time(num){//숫자가 한 자릿수면 앞에 0을 붙여서 반환
    return num < 10 ? `0${num}` : num;
}

function startTimer(){//타이머 시작(시간 측정을 시작하는 함수)
    timerId = setInterval(updateTimer, 1000); //1초마다 타이머 업데이트
}

function stopTimer(){
    clearInterval(timerId);
}

function updateTimer(){ //setInterval에서 반복할 함수
    s++;
    if(s===60){
        s = 0;
        m++;
    }
    timer.textContent = `${format_time(m)}:${format_time(s)}`;//타이머 업데이트
}

//messageBox를 띄우고 / 숨기는 함수
function show_messageBox(){
    messageBox.style.visibility = 'visible';
}

function hide_messageBox(){
    messageBox.style.visibility = 'hidden';
}

//게임 시작(세팅)하는 함수
function startGame(){
    isGaming = true;
    startTimer();
    info.style.visibility = 'hidden';
    //엔터를 치면 게임이 시작되며 inputBox에 포커스가 잡힘 / disabled가 false로 바뀜
    inputBox.disabled = false;
    inputBox.focus();
}

//타자연습을 끝까지 마쳤을때 실행되는 함수
function finishGame(){
    isGaming = false;
    inputBox.disabled = true; //게임이 끝나면 더이상 inputBox에 입력할 수 없음
    stopTimer();

    ///타자수 계산
    total_seconds = m*60 + s;
    //console.log(`타자 수: ${total_KeyInput}, 시간: ${total_seconds}s 타수:${Math.round(total_KeyInput / total_seconds * 60)}`);

    //게임이 끝나면 inputBox에서 포커스가 빠짐 / 종료메시지가 messageBox에 뜸
    continueButton.style.display = 'none';
    user_log.style.display = 'block';
    notice.textContent = "<< FINISH >>";
    messageContent.textContent = "타자연습이 완료되었습니다.";
    user_log.innerHTML = `
        <p>경과시간: ${m}분 ${s}초</p>
        <p>평균 타수: ${Math.round(total_KeyInput / total_seconds * 60)}타</p>
        <p>정확도: ${Math.round((total_correctInput/total_charcters)*100)}%</p>
    `;

    inputBox.blur();
    show_messageBox();
}

//일시정지했던 게임을 다시 진행하는 함수
function continueGame(){
    hide_messageBox(); //아직 게임이 시작되기 전이라면 messageBox만 숨김
    if(isGaming){ //처음에 엔터키를 눌러서 게임이 이미 시작된 경우에만
        startTimer();
        inputBox.disabled = false;
        inputBox.focus();
    }
}

//게임을 초기상태로 돌려놓는 함수
function resetGame(){
    stopTimer();
    s = 0;
    m = 0;
    timer.textContent = "00:00";
    //진행도,타수,정확도 막대 초기화
    proBar.style.width = 0+"%";
    pro.textContent = `0/${sentences.length}`;
    volBar.style.width = 0;
    corBar.style.width = 0;
    //타수 및 정확도 초기화
    total_KeyInput = 0;
    vol.textContent = total_KeyInput;
    total_correctInput = 0;
    total_charcters = 0;
    cor.textContent = `${total_correctInput}%`;

    isGaming = false;
    info.style.visibility = 'visible';
    inputBox.blur();
    inputBox.disabled = true;
    current_sentenceIndex = 0;
    prev.textContent = "";
    cur.textContent = sentences[current_sentenceIndex];
    next.textContent = sentences[current_sentenceIndex+1];
    inputBox.value = "";
}

//게임을 처음부터 다시 시작하는 함수
function restartGame(){
    resetGame();
    //알림창 내용도 리셋함
    notice.textContent = "<< PAUSE >>";
    stopTimer();
    messageContent.innerHTML = `
        <p>타자연습을 종료하시겠습니까?</p>
    `;
    continueButton.style.display = 'block';
    quitButton.style.display = 'block';
    restartButton.style.display = 'block';
    messageBox.style.visibility = 'hidden';
}

//게임을 일시정지하는 함수(알림창이 뜬다/타이머가 측정을 멈춤)
function pauseGame(){
    notice.textContent = "<< PAUSE >>";
    stopTimer();
    messageContent.innerHTML = `
        <p>타자연습을 종료하시겠습니까?</p>
    `;
    show_messageBox();
    inputBox.disabled = true;
}

//게임을 완전히 종료하는 함수
function quitGame(){
    resetGame(); //게임을 초기상태로 되돌려 놓고 종료메시지를 띄움
    continueButton.style.display = 'none';
    quitButton.style.display = 'none';
    user_log.style.display = 'none';
    messageContent.innerHTML = "<p>모든 타자연습을 종료합니다.</p>"
}

document.addEventListener('keydown', function(event){//키가 눌릴때마다
    if(!isGaming && s == 0 && event.key==='Enter'){//처음으로 엔터키를 누르면 게임 시작(이미 게임이 진행된 후 종료된 경우라면 경과시간이 0이 아님)
        startGame();
    }
    else if(isGaming){//게임 진행 도중
        //inputBox에 입력된 사용자 입력을 가져온다. 길이가 현재 따라치는 문장길이보다 크거나 같아지면 문장의 일치 정도 확인(정확도 계산)
        let userInput = inputBox.value;
        if((event.key ==='Enter' && userInput.length === sentences[current_sentenceIndex].length) || (userInput.length > sentences[current_sentenceIndex].length+1)){
                //정확도 계산
                let correct = 0;
                for(let i=0;i<sentences[current_sentenceIndex].length;i++){//직전에 입력을 끝낸 문장을 검사하여 정확한 글자만 카운트
                    if(userInput[i] === sentences[current_sentenceIndex][i]){
                        correct++;
                    }
                }
                total_correctInput += correct; // total_correctInput(누적) 값 업데이트
                let characters = 0;
                for(let i=0;i<sentences[current_sentenceIndex].length;i++){ //현재 문장의 글자 수 세기
                    characters++;
                }
                total_charcters += characters; //total_characters(누적) 값 업데이트
                cor.textContent = `${Math.round((total_correctInput/total_charcters)*100)}%`; //지금까지의 정확도 계산(누적 correct 입력 수/누적 글자수 * 100)

                update_proBar(); //문장이 하나씩 진행될때마다 프로그레스바 갱신
                update_corBar(); //정확도 막대 업데이트
                //입력창 비우기
                inputBox.value = "";
                //sentenceBox에 다음문장 띄우기
                current_sentenceIndex++;
                //아직 문장이 남아있으면 다음 문장으로, 더이상 남은 문장이 없으면 게임 종료
                prev.textContent = sentences[current_sentenceIndex-1];
                if(current_sentenceIndex < sentences.length){
                    cur.textContent = sentences[current_sentenceIndex];
                    next.textContent = sentences[current_sentenceIndex+1];
                }
                else{
                    finishGame();
                }

        }
        
    }
})

inputBox.addEventListener('input', function(event){//inputBox에 내용이 입력될때마다
    const current_userInput = inputBox.value; //현재까지 inputBox에 입력된 내용을 가져온다
    const targetSentence = sentences[current_sentenceIndex]; //현재 연습중인 문장
    let resultHTML = ""; //나중에 sentenceBox에 집어넣을 HTML요소

    ////타자수 계산
    if(event.inputType != 'deleteContentBackward'){
        total_KeyInput++;
        update_volBar(); //타자수를 나타내는 막대 갱신
        vol.textContent = total_KeyInput; 
    }

    for(let i=0;i<targetSentence.length;i++){//사용자가 글자를 입력하면 글자의 배경색이 입혀짐
        if(i<current_userInput.length){//
            if(current_userInput[i] === targetSentence[i]){ //텍스트가 일치한다면 entenceBox의 글씨의 배경색이 회색으로 덮어짐
                resultHTML += `<span style="background-color:gray">${targetSentence[i]}</span>`;
            }
            else{  //텍스트에서 일치하지 않는 부분이 생기면 글씨의 배경색이 빨간색으로 덮힘
                resultHTML += `<span style="background-color:hsla(8, 70%, 54%, 1.00)">${targetSentence[i]}</span>`;
            }
        }
        else{ //아직 사용자가 입력하지 않은 부분은 그대로
            resultHTML += `<span>${targetSentence[i]}</span>`; 
        }
    }

    cur.innerHTML = resultHTML; //생성한 Html요소를 sentenceBox에 붙이기
})

//pause버튼을 누르면 알림창이 뜨면서 게임이 일시정지됨
pauseButton.addEventListener('click', pauseGame);

//게임을 일시정지 했을때 알림창에 뜨는 세가지 버튼들
continueButton.addEventListener('click', continueGame);
restartButton.addEventListener('click', restartGame);
quitButton.addEventListener('click', quitGame);