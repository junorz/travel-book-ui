/**
 * 将 CNY 映射成 {label: "人民币", value: "CNY"}
 * @param {*} currency 
 */
export const mapToLabelValue = (currency) => {
    switch (currency) {
        case "CNY":
            return { label: "人民币", value: "CNY" };
        case "JPY":
            return { label: "日元", value: "JPY" };
        case "USD":
            return { label: "美元", value: "USD" };
        case "EUR":
            return { label: "欧元", value: "EUR" };
        case "CAD":
            return { label: "加元", value: "CAD" };
        case "KRW":
            return { label: "韩元", value: "KRW" };
        case "HKD":
            return { label: "港元", value: "HKD" };
    }
}


/**
 * 将 "CNY" 转换为 "人民币"
 * @param {*} currency 
 */
export const getName = (currency) => {
    const obj = mapToLabelValue(currency);
    return obj["label"];
}