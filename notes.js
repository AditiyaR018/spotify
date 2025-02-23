async function main() {
    let a = await fetch("http://127.0.0.1:3000/songs/");
    const typea = a.headers.get("content-type");//this is to check which tyype of response are we getting
    //a.headers is meta data.
    //The headers provide metadata about the response, such as content type, caching information, and more
    //.get() is used to retrieve value of specific header
    const typeb = await b.text();// html doc as string

}