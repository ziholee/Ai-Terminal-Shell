// 미리 정의된 터미널 명령어 응답 데이터베이스
export interface CommandResponse {
  command: string;
  description: string;
  usage: string;
  examples: string[];
  category: 'file' | 'network' | 'system' | 'security' | 'development' | 'text';
  relatedCommands: string[];
}

export const TERMINAL_COMMANDS: Record<string, CommandResponse> = {
  // 파일 시스템 명령어
  'ls': {
    command: 'ls',
    description: '📁 디렉토리 내용을 나열하는 기본 명령어',
    usage: 'ls [옵션] [디렉토리]',
    examples: [
      'ls -la # 숨김 파일 포함 상세 정보',
      'ls -lh # 파일 크기를 읽기 쉽게 표시',
      'ls -lt # 수정 시간순으로 정렬',
      'ls -lS # 파일 크기순으로 정렬',
      'ls *.txt # txt 파일만 표시'
    ],
    category: 'file',
    relatedCommands: ['cd', 'pwd', 'find', 'tree']
  },

  'cd': {
    command: 'cd',
    description: '📂 디렉토리를 변경하는 명령어',
    usage: 'cd [디렉토리]',
    examples: [
      'cd /home/user # 절대 경로로 이동',
      'cd .. # 상위 디렉토리로 이동',
      'cd ~ # 홈 디렉토리로 이동',
      'cd - # 이전 디렉토리로 이동',
      'cd Documents # 상대 경로로 이동'
    ],
    category: 'file',
    relatedCommands: ['ls', 'pwd', 'pushd', 'popd']
  },

  'pwd': {
    command: 'pwd',
    description: '📍 현재 작업 디렉토리의 전체 경로를 표시',
    usage: 'pwd',
    examples: [
      'pwd # 현재 디렉토리 경로 출력',
      'pwd -P # 심볼릭 링크 해석하여 실제 경로 출력'
    ],
    category: 'file',
    relatedCommands: ['cd', 'ls', 'realpath']
  },

  'cp': {
    command: 'cp',
    description: '📋 파일이나 디렉토리를 복사',
    usage: 'cp [옵션] 원본 대상',
    examples: [
      'cp file.txt backup.txt # 파일 복사',
      'cp -r dir1 dir2 # 디렉토리 재귀 복사',
      'cp -p file.txt backup.txt # 권한과 타임스탬프 유지',
      'cp *.txt /backup/ # 모든 txt 파일 복사',
      'cp -u source dest # 새로운 파일만 복사'
    ],
    category: 'file',
    relatedCommands: ['mv', 'rsync', 'scp']
  },

  'mv': {
    command: 'mv',
    description: '🔄 파일이나 디렉토리를 이동/이름 변경',
    usage: 'mv [옵션] 원본 대상',
    examples: [
      'mv old.txt new.txt # 파일 이름 변경',
      'mv file.txt /home/user/ # 파일 이동',
      'mv *.log /var/log/ # 모든 로그 파일 이동',
      'mv -i file.txt dest # 덮어쓰기 전 확인',
      'mv -n file.txt dest # 덮어쓰기 방지'
    ],
    category: 'file',
    relatedCommands: ['cp', 'rm', 'rename']
  },

  'rm': {
    command: 'rm',
    description: '🗑️ 파일이나 디렉토리를 삭제',
    usage: 'rm [옵션] 파일명',
    examples: [
      'rm file.txt # 파일 삭제',
      'rm -r directory # 디렉토리 재귀 삭제',
      'rm -i *.txt # 삭제 전 확인',
      'rm -f file.txt # 강제 삭제',
      'rm -rf /tmp/old # 강제 재귀 삭제 (주의!)'
    ],
    category: 'file',
    relatedCommands: ['rmdir', 'trash', 'shred']
  },

  'chmod': {
    command: 'chmod',
    description: '🔐 파일이나 디렉토리의 권한을 변경',
    usage: 'chmod [옵션] 권한 파일명',
    examples: [
      'chmod 755 script.sh # 실행 권한 부여',
      'chmod +x file # 실행 권한 추가',
      'chmod -w file # 쓰기 권한 제거',
      'chmod u+r,g-w,o-x file # 세부 권한 설정',
      'chmod -R 644 /var/www # 재귀적 권한 변경'
    ],
    category: 'security',
    relatedCommands: ['chown', 'chgrp', 'umask']
  },

  // 네트워크 명령어
  'ssh': {
    command: 'ssh',
    description: '🔒 원격 서버에 안전하게 연결',
    usage: 'ssh [옵션] 사용자@호스트',
    examples: [
      'ssh user@server.com # 기본 SSH 연결',
      'ssh -p 2222 user@host # 사용자 정의 포트',
      'ssh -i ~/.ssh/key user@host # 특정 키 파일 사용',
      'ssh -L 8080:localhost:80 user@host # 로컬 포트 포워딩',
      'ssh -X user@host # X11 포워딩 활성화'
    ],
    category: 'network',
    relatedCommands: ['scp', 'sftp', 'ssh-keygen', 'ssh-copy-id']
  },

  'scp': {
    command: 'scp',
    description: '📤 SSH를 통한 안전한 파일 복사',
    usage: 'scp [옵션] 원본 대상',
    examples: [
      'scp file.txt user@host:/path/ # 원격으로 파일 복사',
      'scp user@host:/path/file.txt . # 원격에서 파일 가져오기',
      'scp -r directory user@host:/path/ # 디렉토리 복사',
      'scp -P 2222 file user@host:/path/ # 사용자 정의 포트',
      'scp -i key file user@host:/path/ # 특정 키 파일 사용'
    ],
    category: 'network',
    relatedCommands: ['ssh', 'sftp', 'rsync']
  },

  'curl': {
    command: 'curl',
    description: '🌐 URL에서 데이터를 전송하거나 받기',
    usage: 'curl [옵션] URL',
    examples: [
      'curl https://api.example.com # GET 요청',
      'curl -X POST -d "data" url # POST 요청',
      'curl -H "Content-Type: application/json" url # 헤더 설정',
      'curl -o file.zip url # 파일로 다운로드',
      'curl -u user:pass url # 인증 정보 포함'
    ],
    category: 'network',
    relatedCommands: ['wget', 'httpie', 'nc']
  },

  'wget': {
    command: 'wget',
    description: '⬇️ 웹에서 파일을 다운로드',
    usage: 'wget [옵션] URL',
    examples: [
      'wget https://example.com/file.zip # 파일 다운로드',
      'wget -r https://example.com # 재귀적 다운로드',
      'wget -c url # 중단된 다운로드 재개',
      'wget -O newname.zip url # 다른 이름으로 저장',
      'wget --limit-rate=200k url # 다운로드 속도 제한'
    ],
    category: 'network',
    relatedCommands: ['curl', 'aria2c', 'axel']
  },

  'ping': {
    command: 'ping',
    description: '📡 네트워크 연결 상태를 테스트',
    usage: 'ping [옵션] 호스트',
    examples: [
      'ping google.com # 기본 ping 테스트',
      'ping -c 4 host # 4번만 ping',
      'ping -i 2 host # 2초 간격으로 ping',
      'ping -s 1024 host # 패킷 크기 지정',
      'ping -f host # 플러드 ping (관리자 권한 필요)'
    ],
    category: 'network',
    relatedCommands: ['traceroute', 'nslookup', 'dig']
  },

  // 시스템 명령어
  'ps': {
    command: 'ps',
    description: '⚙️ 실행 중인 프로세스 목록 표시',
    usage: 'ps [옵션]',
    examples: [
      'ps aux # 모든 프로세스 상세 정보',
      'ps -ef # 모든 프로세스 전체 형식',
      'ps -u username # 특정 사용자 프로세스',
      'ps -C processname # 특정 프로세스 이름',
      'ps --forest # 프로세스 트리 형태'
    ],
    category: 'system',
    relatedCommands: ['top', 'htop', 'pgrep', 'kill']
  },

  'top': {
    command: 'top',
    description: '📊 실시간 시스템 리소스 모니터링',
    usage: 'top [옵션]',
    examples: [
      'top # 기본 시스템 모니터',
      'top -u username # 특정 사용자 프로세스만',
      'top -p PID # 특정 프로세스만 모니터',
      'top -d 5 # 5초마다 업데이트',
      'top -n 1 # 한 번만 실행 후 종료'
    ],
    category: 'system',
    relatedCommands: ['htop', 'ps', 'iotop', 'vmstat']
  },

  'htop': {
    command: 'htop',
    description: '🎯 향상된 대화형 프로세스 뷰어',
    usage: 'htop [옵션]',
    examples: [
      'htop # 대화형 프로세스 모니터',
      'htop -u username # 특정 사용자 프로세스',
      'htop -p PID1,PID2 # 특정 프로세스들만',
      'htop -t # 트리 뷰로 시작',
      'htop -d 10 # 1초 업데이트 간격'
    ],
    category: 'system',
    relatedCommands: ['top', 'ps', 'iotop', 'nload']
  },

  'kill': {
    command: 'kill',
    description: '💀 프로세스에 시그널 전송 (종료)',
    usage: 'kill [옵션] PID',
    examples: [
      'kill 1234 # 프로세스 정상 종료',
      'kill -9 1234 # 프로세스 강제 종료',
      'kill -STOP 1234 # 프로세스 일시 정지',
      'kill -CONT 1234 # 프로세스 재개',
      'killall firefox # 이름으로 프로세스 종료'
    ],
    category: 'system',
    relatedCommands: ['killall', 'pkill', 'pgrep']
  },

  'df': {
    command: 'df',
    description: '💾 파일 시스템 디스크 사용량 표시',
    usage: 'df [옵션] [파일시스템]',
    examples: [
      'df -h # 읽기 쉬운 형태로 표시',
      'df -i # inode 사용량 표시',
      'df -T # 파일시스템 타입 포함',
      'df /home # 특정 디렉토리 사용량',
      'df --total # 전체 합계 표시'
    ],
    category: 'system',
    relatedCommands: ['du', 'lsblk', 'mount']
  },

  'du': {
    command: 'du',
    description: '📏 디렉토리 사용량 분석',
    usage: 'du [옵션] [디렉토리]',
    examples: [
      'du -h # 읽기 쉬운 형태',
      'du -s * # 각 항목의 총 크기',
      'du -sh /var/log # 특정 디렉토리 크기',
      'du -ah --max-depth=1 # 1단계 깊이까지',
      'du -h | sort -hr # 크기순 정렬'
    ],
    category: 'system',
    relatedCommands: ['df', 'ncdu', 'tree']
  },

  // 개발 도구
  'git': {
    command: 'git',
    description: '🔄 분산 버전 관리 시스템',
    usage: 'git [명령어] [옵션]',
    examples: [
      'git clone https://github.com/user/repo.git # 저장소 복제',
      'git add . # 모든 변경사항 스테이징',
      'git commit -m "message" # 커밋 생성',
      'git push origin main # 원격 저장소에 푸시',
      'git pull # 원격 변경사항 가져오기'
    ],
    category: 'development',
    relatedCommands: ['svn', 'hg', 'bzr']
  },

  'docker': {
    command: 'docker',
    description: '🐳 컨테이너 플랫폼',
    usage: 'docker [명령어] [옵션]',
    examples: [
      'docker run -it ubuntu bash # 대화형 컨테이너 실행',
      'docker ps # 실행 중인 컨테이너 목록',
      'docker images # 이미지 목록',
      'docker build -t myapp . # 이미지 빌드',
      'docker exec -it container bash # 컨테이너 접속'
    ],
    category: 'development',
    relatedCommands: ['docker-compose', 'podman', 'kubectl']
  },

  'npm': {
    command: 'npm',
    description: '📦 Node.js 패키지 매니저',
    usage: 'npm [명령어] [옵션]',
    examples: [
      'npm install package # 패키지 설치',
      'npm install -g package # 전역 설치',
      'npm run start # 스크립트 실행',
      'npm update # 패키지 업데이트',
      'npm audit # 보안 취약점 검사'
    ],
    category: 'development',
    relatedCommands: ['yarn', 'pnpm', 'node']
  },

  // 텍스트 처리
  'grep': {
    command: 'grep',
    description: '🔍 텍스트 패턴 검색',
    usage: 'grep [옵션] 패턴 [파일]',
    examples: [
      'grep "pattern" file.txt # 패턴 검색',
      'grep -r "pattern" /path/ # 재귀 검색',
      'grep -i "pattern" file # 대소문자 무시',
      'grep -v "pattern" file # 패턴 제외',
      'grep -n "pattern" file # 줄 번호 표시'
    ],
    category: 'text',
    relatedCommands: ['egrep', 'fgrep', 'awk', 'sed']
  },

  'sed': {
    command: 'sed',
    description: '✏️ 스트림 에디터 (텍스트 변환)',
    usage: 'sed [옵션] 스크립트 [파일]',
    examples: [
      'sed "s/old/new/g" file # 텍스트 치환',
      'sed -i "s/old/new/g" file # 파일 직접 수정',
      'sed -n "1,5p" file # 1-5줄만 출력',
      'sed "/pattern/d" file # 패턴 줄 삭제',
      'sed "2i\\새 줄" file # 2번째 줄 앞에 삽입'
    ],
    category: 'text',
    relatedCommands: ['awk', 'grep', 'tr']
  },

  'awk': {
    command: 'awk',
    description: '🔧 패턴 스캐닝 및 처리 언어',
    usage: 'awk [옵션] 프로그램 [파일]',
    examples: [
      'awk "{print $1}" file # 첫 번째 필드 출력',
      'awk -F: "{print $1}" /etc/passwd # 구분자 지정',
      'awk "NR==5" file # 5번째 줄만 출력',
      'awk "{sum+=$1} END {print sum}" file # 합계 계산',
      'awk "length($0) > 80" file # 80자 이상 줄'
    ],
    category: 'text',
    relatedCommands: ['sed', 'grep', 'cut']
  },

  'find': {
    command: 'find',
    description: '🔎 파일과 디렉토리 검색',
    usage: 'find [경로] [조건] [액션]',
    examples: [
      'find /home -name "*.txt" # 이름으로 검색',
      'find . -type f -size +100M # 100MB 이상 파일',
      'find /var -mtime -7 # 7일 이내 수정된 파일',
      'find . -perm 755 # 특정 권한 파일',
      'find . -name "*.log" -delete # 검색 후 삭제'
    ],
    category: 'file',
    relatedCommands: ['locate', 'which', 'whereis']
  },

  'tar': {
    command: 'tar',
    description: '📦 아카이브 파일 생성 및 추출',
    usage: 'tar [옵션] [아카이브] [파일들]',
    examples: [
      'tar -czf archive.tar.gz files/ # gzip 압축 생성',
      'tar -xzf archive.tar.gz # gzip 압축 해제',
      'tar -tf archive.tar # 내용 목록 보기',
      'tar -czf backup.tar.gz --exclude="*.log" /home # 제외하고 압축',
      'tar -xzf archive.tar.gz -C /destination # 특정 위치에 해제'
    ],
    category: 'file',
    relatedCommands: ['gzip', 'zip', 'unzip']
  }
};

// 카테고리별 명령어 그룹
export const COMMAND_CATEGORIES = {
  file: '📁 파일 시스템',
  network: '🌐 네트워크',
  system: '⚙️ 시스템',
  security: '🔐 보안',
  development: '💻 개발',
  text: '📝 텍스트 처리'
};

// 명령어 검색 함수
export function searchCommands(query: string): CommandResponse[] {
  const lowerQuery = query.toLowerCase();
  return Object.values(TERMINAL_COMMANDS).filter(cmd => 
    cmd.command.toLowerCase().includes(lowerQuery) ||
    cmd.description.toLowerCase().includes(lowerQuery) ||
    cmd.examples.some(example => example.toLowerCase().includes(lowerQuery))
  );
}

// 관련 명령어 추천
export function getRelatedCommands(commandName: string): CommandResponse[] {
  const command = TERMINAL_COMMANDS[commandName];
  if (!command) return [];
  
  return command.relatedCommands
    .map(name => TERMINAL_COMMANDS[name])
    .filter(Boolean);
}

// 카테고리별 명령어 가져오기
export function getCommandsByCategory(category: keyof typeof COMMAND_CATEGORIES): CommandResponse[] {
  return Object.values(TERMINAL_COMMANDS).filter(cmd => cmd.category === category);
}