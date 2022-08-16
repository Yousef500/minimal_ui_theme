import DateObject from "react-date-object";
import arabic from "react-date-object/calendars/arabic";
import arabic_ar from "react-date-object/locales/arabic_ar";
import arabic_en from "react-date-object/locales/arabic_en";
import gregorian_en from "react-date-object/locales/gregorian_en";

const FormatDate = ({ date, format="dddd DD-MM-YYYY", language="ar", calendar="g" }) => {
    let formattedDate;
    switch (language) {
        case "ar":
            if (calendar === "g") {
                formattedDate = new DateObject({
                    date,
                    locale: arabic_ar,
                }).format(format);
            } else if (calendar === "h") {
                formattedDate = new DateObject({ date, locale: arabic_ar })
                    .convert(arabic)
                    .format(format);
            }
            break;
        case "en":
            if (calendar === "g") {
                formattedDate = new DateObject(date).format(format);
            } else if (calendar === "h") {
                formattedDate = new DateObject({ date, locale: arabic_en })
                    .convert(arabic)
                    .format(format);
            }
            break;
        default:
    }
    return formattedDate;
};

export default FormatDate;
