const generateMessage = async (parcels) => {
    let msg = "Send your first parcel with us!";
    let msgHref = "/parcels";

    if (parcels.length > 0) {
        parcels = parcels.filter(parcel => parcel.status !== "delivered");
        if (parcels.length < 1) {
            msg = "All your parcels have been delivered!";
            msgHref = "/users/history";

        } else if (parcels.length === 1) {
            msg = `You have a parcel to be delivered!`
            msgHref = "/users/history";
        } else {
            msg = `You have ${parcels.length} parcels to be delivered!`
            msgHref = "/users/history";
        }
    }

    return {
        msg,
        msgHref
    }
}

module.exports = generateMessage;