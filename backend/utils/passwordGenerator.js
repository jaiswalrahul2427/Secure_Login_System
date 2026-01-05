function generatePassword() {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const all = upper + lower + numbers;

    let password =
        upper[Math.floor(Math.random() * upper.length)] +
        lower[Math.floor(Math.random() * lower.length)];

    for (let i = 0; i < 6; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    return password;
}

module.exports = generatePassword;