import AsyncStorage from '@react-native-community/async-storage';
export  default  class DataStore {
    //离线缓存的入口方法
    fetchData(url, method, data) {
        const promise = new Promise((resolve, reject) => {
            this.fetchLocalData(url).then((wrapData) => {
                /*
                * if(wrapData && DataStore.checkTimestampValid(wrapData.timestamp) && wrapData.data.code === 1){
                    console.log(111)
                    resolve(wrapData)
                } else {
                    if(method === 'POST' || method === 'post') {
                        this.fetchNetDataPost(url, data).then((data) => {
                            resolve(this._wrapData(data))
                        }).catch((error) => {
                            reject(error)
                        })
                    } else {
                        this.fetchNetDataGet(url).then((data) => {
                            resolve(this._wrapData(data))
                        }).catch((error) => {
                            reject(error)
                        })
                    }
                }
                * */
                if(method === 'POST' || method === 'post') {
                    this.fetchNetDataPost(url, data).then((data) => {
                        resolve(this._wrapData(data))
                    }).catch((error) => {
                        reject(error)
                    })
                } else {
                    this.fetchNetDataGet(url).then((data) => {
                        resolve(this._wrapData(data))
                    }).catch((error) => {
                        reject(error)
                    })
                }
            })
        })
        return promise
    }
    //保存数据
    saveData(url, data, callback) {
        if (!data || !url) return;
        AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
    }
    //获取本地数据
    fetchLocalData(url) {
        const promise = new Promise((resolve, reject) => {
            AsyncStorage.getItem(url, (error, result) => {
                if (!error) {
                    try {
                        resolve(JSON.parse(result))
                    } catch (e) {
                        reject(e)
                        console.error(e)
                    }
                } else {
                    reject(error)
                    console.error(error)
                }
            })
        })
        return promise
    }
    //获取网络数据get
    fetchNetDataGet(url) {
        const promise = new Promise((resolve, reject) => {
            fetch(url)
                .then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error('Network response was not ok.')
                })
                .then((responseData) => {
                    this.saveData(url, responseData)
                    resolve(responseData)
                })
                .catch((error) => {
                    reject(error)
                })
        })
        return promise
    }
    //获取网络数据post
    fetchNetDataPost(url, data){
        const promise = new Promise((resolve, reject) => {
            fetch(url, {
                method:'POST',
                header:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:data
            }).then((response) => {
                    if (response.ok) {
                        return response.json()
                    }
                    throw new Error('Network response was not ok.')
                })
                .then((responseData) => {
                    this.saveData(url, responseData)
                    resolve(responseData)
                })
                .catch((error) => {
                    reject(error)
                })
        })
        return promise
    }
    _wrapData(data) {
        return {data: data, timestamp: new Date().getTime()}
    }

    //有效期检查方法
    static checkTimestampValid(timestamp) {
        const currentDate = new Date();
        const targetDate = new Date();
        targetDate.setTime(timestamp);
        if (currentDate.getMonth() !== targetDate.getMonth()) return false;
        if (currentDate.getDate() !== targetDate.getDate()) return false;
        if (currentDate.getHours() - targetDate.getHours() > 4) return false;
        return true
    }
}
