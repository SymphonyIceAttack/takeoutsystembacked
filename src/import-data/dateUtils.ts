export function getFormattedDate() {
  // 获取当前日期
  const today = new Date();

  // 获取年、月、日
  const year = today.getFullYear();
  let month: any = today.getMonth() + 1; // 月份是从0开始计数的，所以要加1
  let day: any = today.getDate();

  // 将月份和日期格式化为两位数
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }

  // 构建格式化后的日期字符串
  const formattedDate = '' + year + month + day;

  return formattedDate;
}
export const transformPreviousAndNextDay = (
  inputDate: string,
  skip: number,
) => {
  const year = parseInt(inputDate.substring(0, 4));
  const month = parseInt(inputDate.substring(4, 6)) - 1;
  const day = parseInt(inputDate.substring(6, 8));

  const currentDate = new Date(year, month, day);

  const previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - skip);

  const nextDate = new Date(currentDate);
  nextDate.setDate(currentDate.getDate() + skip);

  function formatDate(date: Date) {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}${mm}${dd}`;
  }

  const previousDay = formatDate(previousDate);
  const nextDay = formatDate(nextDate);

  return {
    previousDay,
    nextDay,
  };
};
export function getRandomObjects<T>(array: T[], count: number): T[] {
  // 复制数组以避免修改原始数组

  const newArray = [...array];

  // 验证 count 是否有效
  if (count <= 0 || count > newArray.length) {
    throw new Error('Invalid count');
  }

  // 随机排序数组
  newArray.sort(() => Math.random() - 0.5);

  // 截取前 count 个元素
  const selectedObjects = newArray.slice(0, count);

  return selectedObjects;
}
