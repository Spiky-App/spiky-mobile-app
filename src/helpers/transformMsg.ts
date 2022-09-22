function transformMsg(msg: string) {
    const regexp_all = /(@\[@\w*\]\(\d*\))|(#\[#[A-Za-zÀ-ÖØ-öø-ÿ]+\]\(\d*\))/g;
    const regexp_mention = /(@\[@\w*\]\(\d*\))/g;
    const regexp_hashtag = /(#\[#[A-Za-zÀ-ÖØ-öø-ÿ]+\]\(\d*\))/g;
    const mentions = msg.match(regexp_all);
    const mensaje_split = msg.split(regexp_all);
    let msg_final;
    let msg_trasnform: string[] = [];
    if (mentions) {
        mensaje_split.forEach(string => {
            if (string !== undefined) {
                if (regexp_mention.test(string)) {
                    const alias = string.substring(string.indexOf('[') + 1, string.indexOf(']'));
                    msg_trasnform.push(alias);
                } else if (regexp_hashtag.test(string)) {
                    const hashtag = string.substring(string.indexOf('[') + 1, string.indexOf(']'));
                    msg_trasnform.push(hashtag);
                } else {
                    msg_trasnform.push(string);
                }
            }
        });
        msg_final = msg_trasnform.join('');
    } else {
        msg_final = msg;
    }
    return msg_final;
}

export { transformMsg };
