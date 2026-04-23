const generateOtp = (length: number = 6): string => {
    const digits = "0123456789";
    let otp = "";
    for (let i = 0; i < length; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    otp = otp.padStart(length, "0");
    return otp;
}

export default generateOtp;