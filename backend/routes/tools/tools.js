function makeDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1) < 10 ? `0${date.getMonth() + 1}` : (date.getMonth() + 1);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  return year + "-" + month + "-" + day;;
}

function makeText(bool, item) {
  const text = {};
  if(bool) {
    text.slice = item.slice(0, 200);
  } else {
    text.slice = null;
  }
  text.original = item;
  return text;
}

function makeSum(arr) {
  const sum = [...arr].reduce((acc, cur, index, arr) => {
    return index === arr.length - 1 ? (acc + cur.stars) / arr.length : (acc + cur.stars);
  }, 0);
  return Math.floor(sum * 10) / 10;
}

function ifEssence(digit) {
  const starArr = Array.from({ length: 5 }, (_, index) => {
    if(index + 1 <= digit) {
      return 'full';
    } else {
      return 'empty';
    }  
  });
  const starNum = digit;
  return { starArr, starNum };
}

function ifNotEssence(digit) {
  // 3.8과 2.3를 예로 들때 0.8은 0.5로, 0.3은 0으로...
  let decimal;
  if (digit % 1 < 0.5) {
    decimal = 0;
  } else if (digit % 1 >= 0.5) {
    decimal = 0.5;
  }
  // essence은 내린 수, 3.8은 3으로, 2.3은 2로, 
  const essence = Math.floor(digit);
  const starNum = essence + decimal;
  const starArr = Array.from({ length: 5 }, (_, index) => {
    // essence까지는 채우고, 
    if(index + 1 <= essence) {
      return 'full';
      // decimal이 0.5라면 그 다음 별을 반개 채운다
    } else if(index === essence && decimal === 0.5) {
      return 'half';
    } else {
      // 그 외는 빈별
      return 'empty';
    }  
  });
  return { starArr, starNum };
}

function makeStar(digit) {
  if(digit % 1 === 0) { // 정수라면, 소수점이 없다면, 만약 3이라면
    // 5개의 별을 3개는 채우고, 두개는 비워라
    return ifEssence(digit);
  } else {
    return ifNotEssence(digit);
  }
}

function makeTypeTitle(item, oneBlog) {
  const typeArr = {
    free: '#자유글',
    book: '#독서후기',
    date: '#모임후기',
  };
  const titleArr = {
    free: item.title,
    book: item.Book && item.Book.title,
    date: item.Book && item.Book.meetingDate,
  };
  const titleOne = {
    free: item.title,
    book: item.Book && `[${item.Book.title}-${item.Book.author}]독서 후기`,
    date: item.Book && `[${item.Book.meetingDate}]모임 후기`,
  };
  const type = typeArr[item.type];
  let title;
  if(oneBlog) {
    title = titleOne[item.type];
  } else {
    title = titleArr[item.type];
  }
  return { type, title }
}

function listOffset(page, count, last) {
  let offset;
  if(count === 15 && !!last === true) {
    // 앞의 15개를 보내야 한다.
    offset = (page - 2) * 15;
  } else {
    // 뒤에서 땅겨오기
    // count === 15 && !!last === false도 여기 해당
    offset = (page - 1) * 15 + (15 - count);
  }
  return offset;
}

module.exports = {
  makeDate, 
  makeText, 
  makeSum,
  makeStar,
  makeTypeTitle,
  listOffset,
}