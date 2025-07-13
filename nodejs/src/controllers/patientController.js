import patientService from "../service/patientService";

let postBookAppointment = async (req, res) => {
  try {
    console.log("=== PATIENT BOOKING API CALLED ===");
    console.log("Request body:", req.body);

    let info = await patientService.postBookAppointment(req.body);

    console.log("=== BOOKING RESPONSE ===");
    console.log("Response:", info);

    return res.status(200).json(info);
  } catch (e) {
    console.log("Controller error:", e);
    return res.status(200).json({
      errorCode: -1,
      errorMessage: "Error from server...",
    });
  }
};

module.exports = {
  postBookAppointment: postBookAppointment,
};
