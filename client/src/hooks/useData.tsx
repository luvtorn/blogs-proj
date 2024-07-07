const useData = (isoDate: Date | string | undefined) => {
  if (isoDate) {
    const date = new Date(isoDate);

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    };

    return new Intl.DateTimeFormat("en", options).format(date);
  }
};

export default useData;
