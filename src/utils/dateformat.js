// const year = now.getFullYear();
// const month = ('0' + (now.getMonth() + 1)).slice(-2);
// const day = ('0' + now.getDate()).slice(-2);
// const hours = ('0' + now.getHours()).slice(-2);
// const minutes = ('0' + now.getMinutes()).slice(-2);
// const seconds = ('0' + now.getSeconds()).slice(-2);
//const formattedTime = year + month + day + hours + minutes + seconds;

// console.log(date.toJSON().replace(/[-T:Z.]/g, ''))
function padLeftZero(str) {
  return ('00' + str).substr(str.length);
}

export function formatDate(date, fmt) {
  console.log(date)
  console.log(fmt)
  if (!date) {
    return '';
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};


export function calculateLeaveHours(dtStart, dtEnd, workTime, isContainHoliday, isNursing,workDays) {
  const [startWorkStr, endWorkStr] = workTime.split("-");
  const [startWorkHour, startWorkMinute] = startWorkStr.split(":").map(Number);
  const [endWorkHour, endWorkMinute] = endWorkStr.split(":").map(Number);

  dtStart = new Date(dtStart);
  dtEnd = new Date(dtEnd);
 
  let leaveDuration = 0;
  if (isContainHoliday) {
    leaveDuration = ((new Date(dtEnd).getDate() - new Date(dtStart).getDate()) + 1) * 8;
  } else {
    const startWork = new Date(new Date(dtStart).getFullYear(), new Date(dtStart).getMonth(), new Date(dtStart).getDate(), startWorkHour, startWorkMinute, 0);
    dtStart = dtStart < startWork ? startWork : dtStart;

    let startDate=new Date(dtStart.getFullYear(),dtStart.getMonth(),dtStart.getDate());
    let endDate=new Date(dtEnd.getFullYear(),dtEnd.getMonth(),dtEnd.getDate());
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    // for (let date = new Date(dtStart); date <= new Date(dtEnd); date.setDate(date.getDate() + 1)) {
      const morningStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), startWorkHour, startWorkMinute);
      const morningEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 0, 0);
      const afternoonStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 13, 0, 0);
      const afternoonEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate(), endWorkHour, endWorkMinute);
      // debugger
      if (IsWorkDay(date,workDays)) {
        if(isNursing)
        {
          leaveDuration+=1;
          continue;
        }
        if (dtStart >= afternoonEnd) {
          dtStart = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, startWorkHour, startWorkMinute);
          continue;
        }
        if (dtEnd <= morningStart) {
          dtEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1, endWorkHour, endWorkMinute);
          continue;
        }

        let adjustedStartTime = dtStart > morningStart ? dtStart : morningStart;
        adjustedStartTime = (adjustedStartTime > morningEnd && adjustedStartTime < afternoonStart) ? morningEnd : adjustedStartTime;
        let adjustedEndTime = dtEnd < afternoonEnd ? dtEnd : afternoonEnd;

        let dailyLeaveDuration = (adjustedEndTime - adjustedStartTime) / (1000 * 60 * 60);
        if (adjustedEndTime >= afternoonStart && adjustedStartTime <= morningEnd) {
          dailyLeaveDuration -= 1;
        }

        leaveDuration += dailyLeaveDuration;
      }
    }
  } 
  return RoundToNearestHalf(leaveDuration);
}



export function CalculateTotalHours1(dtStart, dtEnd, workDays = null) {

  dtStart = new Date(dtStart);
  dtEnd = new Date(dtEnd);
 
  let dtFirstDayGoToWork = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 8, 30, 0); //请假第一天的上班时间
  let dtFirstDayGoOffWork = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 17, 30, 0); //请假第一天的下班时间

  let dtLastDayGoToWork = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 8, 30, 0); //请假最后一天的上班时间
  let dtLastDayGoOffWork = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 17, 30, 0); //请假最后一天的下班时间

  let dtFirstDayRestStart = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 12, 0, 0); //请假第一天的午休开始时间
  let dtFirstDayRestEnd = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 13, 0, 0); //请假第一天的午休结束时间

  let dtLastDayRestStart = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 12, 0, 0); //请假最后一天的午休开始时间
  let dtLastDayRestEnd = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 13, 0, 0); //请假最后一天的午休结束时间


  //如果开始请假时间早于上班时间或者结束请假时间晚于下班时间，者需要重置时间
  if (!IsWorkDay(dtStart, workDays) && !IsWorkDay(dtEnd, workDays))
    return 0;
  if (dtStart >= dtFirstDayGoOffWork && dtEnd <= dtLastDayGoToWork && (dtEnd - dtStart).getTime() < 86400000)
    return 0;
  if (dtStart >= dtFirstDayGoOffWork && !IsWorkDay(dtEnd, workDays) && (dtEnd - dtStart).getTime() < 86400000)
    return 0;


  if (dtStart < dtFirstDayGoToWork)//早于上班时间
    dtStart = dtFirstDayGoToWork;
  if (dtStart >= dtFirstDayGoOffWork)//晚于下班时间
  {
    while (dtStart < dtEnd) {
      dtStart = new Date(dtStart.setDate(dtStart.getDate() + 1), 8, 30, 0);
      if (IsWorkDay(dtStart, workDays)) {
        dtFirstDayGoToWork = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 8, 30, 0); //请假第一天的上班时间
        dtFirstDayGoOffWork = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 17, 30, 0); //请假第一天的下班时间
        dtFirstDayRestStart = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 11, 30, 0); //请假第一天的午休开始时间
        dtFirstDayRestEnd = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 12, 30, 0); //请假第一天的午休结束时间

        break;
      }
    }
  }

  if (dtEnd > dtLastDayGoOffWork)//晚于下班时间
    dtEnd = dtLastDayGoOffWork;
  if (dtEnd <= dtLastDayGoToWork)//早于上班时间
  {
    while (dtEnd > dtStart) {
      dtEnd = new Date(dtEnd.setDate(dtStart.getDate() - 1), 17, 30, 0);
      if (IsWorkDay(dtEnd, workDays))//
      {
        dtLastDayGoToWork = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 8, 30, 0); //请假最后一天的上班时间
        dtLastDayGoOffWork = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 17, 30, 0); //请假最后一天的下班时间
        dtLastDayRestStart = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 11, 30, 0); //请假最后一天的午休开始时间
        dtLastDayRestEnd = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 12, 30, 0); //请假最后一天的午休结束时间
        break;
      }
    }
  }

  
  let iSumMinute = ((dtFirstDayGoOffWork.getTime() - dtStart.getTime())  + (dtEnd.getTime() - dtLastDayGoToWork.getTime()))/60/1000; //计算获得剩余的分钟数
  // console.log(iSumMinute)
  if (dtStart > dtFirstDayRestStart && dtStart < dtFirstDayRestEnd) {
    //开始休假时间正好是在午休时间内的，需要扣除掉
    iSumMinute -= (dtFirstDayRestEnd.getTime() - dtStart.getTime()) / 60/1000;
  }
  if (dtStart < dtFirstDayRestStart) {
    //如果是在午休前开始休假的就自动减去午休的60分钟
    iSumMinute -= 60;
  }
  if (dtEnd > dtLastDayRestStart && dtEnd < dtLastDayRestEnd) {
    //如果结束休假是在午休时间内的，例如“请假截止日是1月31日 12:00分”的话那休假时间计算只到 11:30分为止。
    iSumMinute -= (dtEnd.getTime() - dtLastDayRestStart.getTime()) / 60/1000;
  }
  if (dtEnd > dtLastDayRestEnd) {
    //如果是在午休后结束请假的就自动减去午休的60分钟
    iSumMinute -= 60;
  }

  let leaveday = 0; //实际请假的天数
  let countday = 0; //获取两个日期间的总天数

  let tempDate = new Date(dtStart.getTime()); //临时参数
  while (tempDate < dtEnd) {
    countday++;
    tempDate = new Date(tempDate.setDate(tempDate.getDate() + 1));
  }
  //循环用来扣除双休日、法定假日 和 添加调休上班
  for (let i = 0; i < countday; i++) {
    let tempdt = new Date(dtStart.getTime());
    tempdt.setDate(tempdt.getDate() + i);

    if (IsWorkDay(tempdt, workDays))
      leaveday++;
  }

  //去掉请假第一天和请假的最后一天，其余时间全部已8小时计算。
  //SumMinute/60： 独立计算 请假第一天和请假最后一天总归请了多少小时的假
  let doubleSumHours = RoundToNearestHalf(((leaveday - 2) * 8) + iSumMinute / 60);

  return doubleSumHours;
}



export function CalculateTotalHours(dtStart, dtEnd, workDays = null) {

  dtStart = new Date(dtStart);
  dtEnd = new Date(dtEnd);
  debugger
 
  let dtFirstDayGoToWork = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 8, 30, 0); //请假第一天的上班时间
  let dtFirstDayGoOffWork = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 17, 30, 0); //请假第一天的下班时间

  let dtLastDayGoToWork = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 8, 30, 0); //请假最后一天的上班时间
  let dtLastDayGoOffWork = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 17, 30, 0); //请假最后一天的下班时间

  let dtFirstDayRestStart = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 12, 0, 0); //请假第一天的午休开始时间
  let dtFirstDayRestEnd = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 13, 0, 0); //请假第一天的午休结束时间

  let dtLastDayRestStart = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 12, 0, 0); //请假最后一天的午休开始时间
  let dtLastDayRestEnd = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 13, 0, 0); //请假最后一天的午休结束时间


  //如果开始请假时间早于上班时间或者结束请假时间晚于下班时间，者需要重置时间
  // if (!IsWorkDay(dtStart, workDays) && !IsWorkDay(dtEnd, workDays))
  //   return 0;
  if((dtEnd - dtStart)/ 86400000<=0)
    return 0;
  // if (dtStart >= dtFirstDayGoOffWork && dtEnd <= dtLastDayGoToWork )
  //   return 0;
  // if (dtStart >= dtFirstDayGoOffWork && !IsWorkDay(dtEnd, workDays) && (dtEnd - dtStart).getTime() < 86400000)
  //   return 0;
  const tempEndDate=new Date(dtEnd.getFullYear(),dtEnd.getMonth(),dtEnd.getDate(),dtEnd.getHours(),dtEnd.getMinutes());
  const tempStartDate=new Date(dtStart.getFullYear(),dtStart.getMonth(),dtStart.getDate(),dtStart.getHours(),dtStart.getMinutes());
 
  if (dtStart < dtFirstDayGoToWork)//早于上班时间
    dtStart = dtFirstDayGoToWork;
  if (dtStart >= dtFirstDayGoOffWork)//晚于下班时间
  {
    while(tempStartDate < tempEndDate) {
    //while(dtStart < dtEnd) {
      // dtStart = new Date(dtStart.setDate(dtStart.getDate() + 1), 8, 30, 0);
      // console.log(dtStart.getDate())
      dtStart = new Date(dtStart.setDate(dtStart.getDate() + 1))
      dtStart = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 8, 30, 0);
      if(IsWorkDay(dtStart, workDays)) 
      {
        dtFirstDayGoToWork = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 8, 30, 0); //请假第一天的上班时间
        dtFirstDayGoOffWork = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 17, 30, 0); //请假第一天的下班时间
        dtFirstDayRestStart = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 11, 30, 0); //请假第一天的午休开始时间
        dtFirstDayRestEnd = new Date(dtStart.getFullYear(), dtStart.getMonth(), dtStart.getDate(), 12, 30, 0); //请假第一天的午休结束时间
        break;
      }
    } 
  }

  if (dtEnd > dtLastDayGoOffWork)//晚于下班时间
    dtEnd = dtLastDayGoOffWork;
  if (dtEnd <= dtLastDayGoToWork)//早于上班时间
  {
     while(tempEndDate > tempStartDate) {
     //while(dtEnd > dtStart) {
      // dtEnd = new Date(dtEnd.setDate(dtStart.getDate() - 1), 17, 30, 0);
      // console.log(dtEnd.getDate()) 
      dtEnd = new Date(dtEnd.setDate(dtEnd.getDate() - 1))
      dtEnd = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 17, 30, 0); 
      if (IsWorkDay(dtEnd, workDays))//
      {
        dtLastDayGoToWork = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 8, 30, 0); //请假最后一天的上班时间
        dtLastDayGoOffWork = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 17, 30, 0); //请假最后一天的下班时间
        dtLastDayRestStart = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 11, 30, 0); //请假最后一天的午休开始时间
        dtLastDayRestEnd = new Date(dtEnd.getFullYear(), dtEnd.getMonth(), dtEnd.getDate(), 12, 30, 0); //请假最后一天的午休结束时间
        break;
      } 
    } 
  }
 

  let iSumMinute = ((dtFirstDayGoOffWork.getTime() - dtStart.getTime())  + (dtEnd.getTime() - dtLastDayGoToWork.getTime()))/60/1000; //计算获得剩余的分钟数
  // console.log(iSumMinute)
  if (dtStart >= dtFirstDayRestStart && dtStart <= dtFirstDayRestEnd) {
    //开始休假时间正好是在午休时间内的，需要扣除掉
    iSumMinute -= (dtFirstDayRestEnd.getTime() - dtStart.getTime()) / 60/1000;
  }
  if (dtStart <= dtFirstDayRestStart) {
    //如果是在午休前开始休假的就自动减去午休的60分钟
    iSumMinute -= 60;
  }
  if (dtEnd >= dtLastDayRestStart && dtEnd <= dtLastDayRestEnd) {
    //如果结束休假是在午休时间内的，例如“请假截止日是1月31日 12:00分”的话那休假时间计算只到 11:30分为止。
    iSumMinute -= (dtEnd.getTime() - dtLastDayRestStart.getTime()) / 60/1000;
  }
  if (dtEnd > dtLastDayRestEnd) {
    //如果是在午休后结束请假的就自动减去午休的60分钟
    iSumMinute -= 60;
  }

  let leaveday = 0; //实际请假的天数
  let countday = 0; //获取两个日期间的总天数

  let tempDate = new Date(dtStart.getTime()); //临时参数
  while (tempDate < dtEnd) {
    countday++;
    tempDate = new Date(tempDate.setDate(tempDate.getDate() + 1));
  }
  //循环用来扣除双休日、法定假日 和 添加调休上班
  for (let i = 0; i < countday; i++) {
    let tempdt = new Date(dtStart.getTime());
    tempdt.setDate(tempdt.getDate() + i);

    if (IsWorkDay(tempdt, workDays))
      leaveday++;
  }

  //去掉请假第一天和请假的最后一天，其余时间全部已8小时计算。
  //SumMinute/60： 独立计算 请假第一天和请假最后一天总归请了多少小时的假
  let doubleSumHours = RoundToNearestHalf(((leaveday - 2) * 8) + iSumMinute / 60);

  return doubleSumHours;
}

function IsWorkDay(date, holidays) {
  var m_simVacationData = holidays[date.getFullYear()];
 
  let dateKey=new Date(date);
  dateKey.setMinutes(dateKey.getMinutes() - dateKey.getTimezoneOffset()); // 时区补偿 
  // console.log(dateKey.toISOString()) 
  var DateKey = dateKey.toISOString().split('T')[0];//日期值：“2012-08-01”
  // console.log(DateKey)
  let b_wokrdate = !(m_simVacationData.filter(i=>i==DateKey).length>0);
  // console.log(b_wokrdate)
  return b_wokrdate;
}

function RoundToNearestHalf(value) {
  let rounded = Math.round(value / 0.5);
  return rounded * 0.5;
}

 