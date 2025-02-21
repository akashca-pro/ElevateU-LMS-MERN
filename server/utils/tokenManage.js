import 'dotenv/config'

export const sendToken = async(res,name,value,age)=>{
    res.cookie(name,value,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: age
   })
}

export const clearToken = async(res,accessTokenName,refreshTokenName)=>{
    res.cookie(accessTokenName, "", { expires: new Date(0) });
    res.cookie(refreshTokenName, "", { expires: new Date(0) });
}

