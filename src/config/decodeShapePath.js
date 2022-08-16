import { decode } from "@googlemaps/polyline-codec";

const decodeShapePath = (shapePath) => {
    if (shapePath) {
        const decodedShapePath = decode(shapePath, 5);
        const paths = decodedShapePath.reduce(
            (prevPoints, point) => [...prevPoints, { lat: point[0], lng: point[1] }],
            []
        );

        return paths;
    }
    return [];
};

export default decodeShapePath;
