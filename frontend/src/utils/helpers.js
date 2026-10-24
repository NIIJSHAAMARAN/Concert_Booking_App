// import { format, isPast, formatDistanceToNow } from 'date-fns';

// export const fmtDate     = (d) => format(new Date(d), 'EEE, MMM d yyyy');
// export const fmtTime     = (d) => format(new Date(d), 'h:mm a');
// export const fmtDateTime = (d) => format(new Date(d), 'EEE MMM d, yyyy · h:mm a');
// export const fmtMoney    = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
// export const isPastDate  = (d) => isPast(new Date(d));
// export const fromNow     = (d) => formatDistanceToNow(new Date(d), { addSuffix: true });

// export const errMsg = (err) =>
//   err?.response?.data?.message ||
//   err?.response?.data?.errors?.[0]?.message ||
//   err?.message || 'Something went wrong';

// export const GENRES = ['Rock','Pop','Jazz','Classical','Hip-Hop','Electronic','Country','R&B','Other'];

// export const GENRE_COLOR = {
//   Rock:'#ff5959', Pop:'#ff9640', Jazz:'#3ddc84', Classical:'#5b9fff',
//   'Hip-Hop':'#b47eff', Electronic:'#e8ff5a', Country:'#ffd166',
//   'R&B':'#ff6eb4', Other:'#8f8fa8',
// };
export const fmtDate = (d) => {
  const date = new Date(d);
  return date.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
};
export const fmtTime = (d) => {
  return new Date(d).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
};
export const fmtDateTime = (d) => `${fmtDate(d)} · ${fmtTime(d)}`;
export const fmtMoney    = (n) => new Intl.NumberFormat('en-IN', { style:'currency', currency:'INR', maximumFractionDigits:0 }).format(n);
export const isPastDate  = (d) => new Date(d) < new Date();
export const fromNow     = (d) => {
  const diff = new Date(d) - new Date();
  const abs  = Math.abs(diff);
  const mins = Math.floor(abs / 60000);
  const hrs  = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);
  const suffix = diff < 0 ? ' ago' : ' from now';
  if (days > 0)  return `${days} day${days>1?'s':''}${suffix}`;
  if (hrs > 0)   return `${hrs} hour${hrs>1?'s':''}${suffix}`;
  return `${mins} minute${mins>1?'s':''}${suffix}`;
};

export const errMsg = (err) =>
  err?.response?.data?.message ||
  err?.response?.data?.errors?.[0]?.message ||
  err?.message || 'Something went wrong';

export const GENRES = ['Rock','Pop','Jazz','Classical','Hip-Hop','Electronic','Country','R&B','Other'];

export const GENRE_COLOR = {
  Rock:'#ff5959', Pop:'#ff9640', Jazz:'#3ddc84', Classical:'#5b9fff',
  'Hip-Hop':'#b47eff', Electronic:'#e8ff5a', Country:'#ffd166',
  'R&B':'#ff6eb4', Other:'#8f8fa8',
};