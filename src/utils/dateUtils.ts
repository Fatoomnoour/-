import { Timestamp } from "firebase/firestore";

type DateLike =
  | Timestamp
  | Date
  | string
  | number
  | { seconds?: number; nanoseconds?: number }
  | null
  | undefined;

export function formatFirestoreDate(dateValue: DateLike): string {
  if (!dateValue) {
    return "غير محدد";
  }

  let date: Date;

  if (dateValue instanceof Timestamp) {
    date = dateValue.toDate();
  } else if (dateValue instanceof Date) {
    date = dateValue;
  } else if (
    typeof dateValue === "object" &&
    typeof dateValue.seconds === "number"
  ) {
    date = new Date(dateValue.seconds * 1000);
  } else {
    date = new Date(dateValue);
  }

  if (Number.isNaN(date.getTime())) {
    return "غير محدد";
  }

  return new Intl.DateTimeFormat("ar-EG", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}