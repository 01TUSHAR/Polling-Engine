import crypto from "node:crypto"

const generateToken = () =>{
    return crypto.randomUUID();
}

export default generateToken;