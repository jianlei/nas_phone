"use strict";

var MobileItem = function(text) {
	if (text) {
		var obj = JSON.parse(text);
		this.author = obj.author;
        this.phoneId = obj.phoneId;
        this.pinpai = obj.pinpai;
        this.model = obj.model;
        this.price = obj.price;
	} else {
        this.author = "";
        this.phoneId = "";//唯一识别码
        this.pinpai = "";//品牌;
        this.model = "";//型号
        this.price = "";//价格
    }
};

MobileItem.prototype = {
    /**
     *  为了使用LocalContractStorage存储，需要对对象进行序列化
     * @returns {string}
     */
	toString: function () {
		return JSON.stringify(this);
	}
};

var MobilePhoneContract = function () {
    LocalContractStorage.defineMapProperty(this, "repo", {
        parse: function (text) {
            return new MobileItem(text);
        },
        stringify: function (o) {
            return o.toString();
        }
    });
};

MobilePhoneContract.prototype = {
    init: function () {
        // todo
    },

    save: function (phoneId, pinpai, model, price) {

        phoneId = phoneId.trim();
        pinpai = pinpai.trim();
        model = model.trim();
        price = price.trim();
        if (phoneId === "" || pinpai === "" || model === "" || price === ""){
            throw new Error("empty key / value");
        }
        if (phoneId.length > 64 || pinpai.length > 64 || model.length > 64 || price.length > 64){
            throw new Error("key / value exceed limit length")
        }

        var from = Blockchain.transaction.from;
        var mobileItem = this.repo.get(phoneId);
        if (mobileItem){
            throw new Error("value has been occupied");
        }

        mobileItem = new MobileItem();
        mobileItem.phoneId = phoneId;
        mobileItem.pinpai = pinpai;
        mobileItem.model = model;
        mobileItem.price = price;

        this.repo.put(phoneId, mobileItem);
    },

    get: function (phoneId) {
        phoneId = phoneId.trim();
        if ( phoneId === "" ) {
            throw new Error("empty pinpai")
        }
        return this.repo.get(phoneId);
    }
};
module.exports = MobilePhoneContract;