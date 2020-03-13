export default class HttpUtils{
    static get(url){
        return new Promise((resolve,reject)=>{
            fetch(url)
                .then((response)=>{
                    if(response.ok) {
                       return response.json()
                    }
                    throw new Error('Network response was not ok. ')
                })
                .then((result)=>{
                    resolve(result);
                })
                .catch((error)=>{
                    reject(error);
                })
        })
    }
    static post(url,data){
        return new Promise((resolve,reject)=>{
            fetch(url,{
                method:'POST',
                header:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                body:data
            })
                .then((response)=>{
                    if(response.ok) {
                        return response.json()
                    }
                    throw new Error('Network response was not ok. ')
                })
                .then((result)=>{
                    resolve(result);
                })
                .catch((error)=>{
                    reject(error);
                })
        })
    }
}
