import { AES, enc } from 'crypto-js';

const salt = 'translate-#dsadfd-salt';

class BrowserStorage {
    setLocalStorage(key, value) {
        const encryptedValue = AES.encrypt(value, salt).toString();
        localStorage.setItem(key, encryptedValue);
    }

    getLocalStorage(key) {
        const encryptedValue = localStorage.getItem(key);
        if (!encryptedValue) return null;
        const decryptedValue = AES.decrypt(encryptedValue, salt).toString(enc.Utf8);
        return decryptedValue;
    }

    removeLocalStorage(key) {
        localStorage.removeItem(key);
    }

    clearLocalStorage() {
        localStorage.clear();
    }
}

export default new BrowserStorage();