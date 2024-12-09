const patterns = {
    // name: /^[a-zA-Z\s]+$/,
    name: /^[a-zA-Z\s.\-&:\/()]+$/,
    nameWithAlphaNumeric: /^[a-zA-Z0-9\s.\-:\/]+$/,
    mobile: /^(?!0{10})\d{10}$/,
    password: /^(?=.*[!@#$%^&*])(?=.*\d)[a-zA-Z\d!@#$%^&*]{6,}$/,
    question: /^[a-zA-Z0-9\s\?\-\(\)\'\"\/,&!]+$/,
    numberString: /^\d*\.?\d*$/, // number string only
    percentage: /^([<>]?\d{1,3}%(-\s*\d{1,3}%)?)$/,
}
module.exports = { patterns };