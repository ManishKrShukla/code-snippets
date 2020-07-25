function MyPromise(execute) {
    let success = null
    let error = null
    let nextResolver = null

    let successResponse = null

    const resolve = (response) => {
        if (success) {
            successResponse = success(response)

            if (successResponse) {
                if (successResponse.prototype !== 'MyPromise') {
                    nextResolver(successResponse)
                } else {
                    successResponse.then((res) => nextResolver(res))
                }
            }
        } else {
            successResponse = response
        }
    }

    const reject = (err) => {
        error(err)
    }

    execute(resolve, reject)

    return {
        prototype: 'MyPromise',
        then: (fn1, fn2) => {
            success = fn1;
            error = fn2;

            if (successResponse) {
                success(successResponse)
            }
            
            var promise = new MyPromise(function(resolve) {
                nextResolver = resolve
            });

            return promise;
        }
    }
}

var P1 = new MyPromise((resolve) => {
    setTimeout(() => {
        resolve(100)
    }, 300)
})

var P2 = new MyPromise((resolve) => {
    setTimeout(() => {
        resolve(200)
    }, 5000)
})

var P3 = new MyPromise((resolve) => {
    resolve(300)
})

var P4 = new MyPromise((resolve) => {
    resolve(400)
})

P1.then((response) => {
    console.log(response)
    return P2
}).then((res) => {
    console.log(res)
    return P3
}).then((res) => {
    console.log(res)
    return P4
}).then((res) => {
    console.log(res)
})
