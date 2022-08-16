import { getLocationAndShifts } from "config/axios/locationsService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const LocationDetails = () => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();

    useEffect(() => {
        (async () => {
            try {
                const [{ data: location }, { data: shifts }] = await getLocationAndShifts(id);
                console.log({ location }, { shifts });
            } catch (err) {
                console.log({ err });
            }
        })();
    }, [id]);

    return <div>s</div>;
};

export default LocationDetails;
