import bcrypt
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
def verify(plainp, hashedp):
    print("PLAIN:", plainp)
    print("HASHED:", hashedp)
    result= bcrypt.checkpw(plainp.encode('utf-8'), hashedp.encode('utf-8'))
    return result