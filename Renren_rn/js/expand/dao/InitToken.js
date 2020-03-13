import AsyncStorage from '@react-native-community/async-storage';
import HttpUrl from '../../utils/Http';
export default class InitToken {
    //更新token入口
    goInitToken(){
        const promise = new Promise((resolve, reject) => {
            let tokenData = '';
            AsyncStorage.getItem('token', (error, result) => {
                tokenData = result?JSON.parse(result):''
                if(!tokenData) {
                    resolve(false)
                } else {
                    this.checkToken(tokenData).then(res => {
                        if(res) {
                            resolve(true)
                        } else {
                            resolve(false)
                        }
                    })
                }
            })

        })
        return promise
    }
    //验证token是否过期
    checkToken(token) {
        const promise = new Promise((resolve, reject) => {
            let tokenState = false;
            let formData=new FormData();
            formData.append('token',token);
            formData.append('flag',0);
            fetch(HttpUrl + 'Banner/bannerlist', {
                method:'POST',
                header:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:formData
            }).then(res => {
                return res.json()
            }).then(resData => {
                if(resData.code === 1) {
                    tokenState = true
                    resolve(tokenState)
                } else if (resData.code === 3 || resData.code === 0 || resData.code === 4) {
                    tokenState = false
                    resolve(tokenState)
                }
            })
        })
        return promise;
    }
}
