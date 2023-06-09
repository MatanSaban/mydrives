import React from "react";
import { GoogleMap, Marker, InfoWindow, useLoadScript } from "@react-google-maps/api";
import styles from './mappopup.module.scss'

const MapPopup = (props) => {
    const [selectedLocation, setSelectedLocation] = React.useState(null);

    const handleMarkerClick = (location) => {
        setSelectedLocation(location);
    };

    // const { isLoaded } = useLoadScript({
    //     googleMapsApiKey: "AIzaSyDgjKrFe0QRKr2bDKhKsxjEiphntKAs1hk", // replace with your actual API key
    // });

    const handleMapClick = (event) => {
        const lat = event.latLng.lat();
        const lng = event.latLng.lng();

        // only run the geocoder if the Google Maps API has loaded
        // if (isLoaded) {
        // create a new Geocoder instance
        const geocoder = new window.google.maps.Geocoder();

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
            if (status === "OK") {
                if (results[0]) {
                    setSelectedLocation({
                        name: results[0].formatted_address,
                        lat,
                        lng,
                    });
                } else {
                    console.log("No results found");
                }
            } else {
                console.error("Geocoder failed due to: " + status);
            }
        });
        // }
    };

    const handleConfirmClick = (e) => {
        props.onSelect(selectedLocation);
        setSelectedLocation(null); // clear the selected location
        props.handleInputFocus(false, e);
        props.handlePopup(
            false,
            <MapPopup
                handleInputFocus={props.handleInputFocus}
                onSelect={props.handleMapSelect}
            />
        );
    };

    // Placeholder locations for markers
    const locations = [
        { id: 1, name: "israelLatLng", lat: 32.046089, lng: 34.851612 },
        { id: 2, name: "Location 2", lat: 10, lng: 10 },
    ];
    const israelLatLng = { lat: 32.046089, lng: 34.851612 };

    return (
        <div className={styles.mapPopup}>
            <GoogleMap
                id="map"
                mapContainerStyle={{
                    height: "400px",
                    width: "800px",
                }}
                zoom={9}
                center={israelLatLng}
                onClick={handleMapClick}
            >
                {locations.map((location) => (
                    <Marker
                        key={location.id}
                        position={{ lat: location.lat, lng: location.lng }}
                        onClick={() => handleMarkerClick(location)}
                    />
                ))}

                {selectedLocation && (
                    <InfoWindow
                        position={{
                            lat: selectedLocation.lat,
                            lng: selectedLocation.lng,
                        }}
                        onCloseClick={() => setSelectedLocation(null)}
                        options={{
                            closeBoxURL: "",
                            enableEventPropagation: false,
                        }}
                    >
                        <div className={styles.locationSelectionWrapper}>
                            <h2>{selectedLocation.name}</h2>
                            {/* <button
                                className="closePopup"
                                onClick={() => setSelectedLocation(null)}
                            >
                                X
                            </button> */}
                            <button onClick={handleConfirmClick}>
                                בחירת מיקום
                            </button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </div>
    );
};

export default MapPopup;
