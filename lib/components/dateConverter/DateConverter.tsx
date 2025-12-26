import moment from "moment";

const DateConverter = ({
  mongoDate,
  format,
}: {
  mongoDate: any;
  format?: string;
}) => {
  const convertMongoDate = (mongoDateStr: any) => {
    const mongoDate = moment.utc(mongoDateStr);
    const formattedDate = mongoDate.format(
      format ? format : "MM/DD/YYYY HH:mm"
    );
    return formattedDate;
  };

  const formattedDate = convertMongoDate(mongoDate);

  return (
    <div>
      <p>{formattedDate}</p>
    </div>
  );
};

export default DateConverter;
