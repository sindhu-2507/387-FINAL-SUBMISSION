const session = require('../utils/database');
const util = require('util');
const similarity = require('string-cosine-similarity')
const stringSimilarity = require("string-similarity");


exports.get_register_test = async (req,res,next) => {
    //console.log("aaa");
    res.render('register', {
        pageTitle: 'Register',
        path: '/register',
        editing: false
    });
}
global.uname = undefined;
exports.post_register_test = async (req,res,next) => {
    const input = await req.body.signal;
    //console.log("aaaaaa")
    //console.log(input);
    if(input==1){
        //wconsole.log("i am here");
        const username = req.body.username;
        const psswd = req.body.password;
        const name = req.body.name;
        const gender = req.body.gender;
        const country = req.body.country;
        const dob = req.body.dob.toString();
        console.log(typeof dob);
        const cypher = util.format('match(m:User{username:"%s"}) return count(m) as val;',username);
        const resp = await session.run(cypher);
        const cypher1 = util.format('match(m:User{Password:"%s"}) return count(m) as val;',psswd);
        const resp1 = await session.run(cypher1);
        const cypher2 = util.format('match(m:User{username:"%s",Password:"%s"}) return count(m) as val;',username,psswd);
        const resp2 = await session.run(cypher2);
        val1 = resp.records[0].get('val').toInt();
        val2 = resp1.records[0].get('val').toInt();
        val3 = resp2.records[0].get('val').toInt();
        //console.log(val1);
        //console.log(val2);
        //console.log(val3);
        if(val1==0 && val2==0 && val3==0){
            console.log("inside");
            const cypher3 = util.format('CREATE (user: User {username :"%s",Name:"%s",Password:"%s",DOB:"%s",Gender:"%s",Country:"%s"});',username,name,psswd,dob,gender,country);
            const resp3 = await session.run(cypher3);
            uname = username;
            res.redirect('/home');
        }
        //console.log("reached");
    }

    if(input==2){
        res.redirect('/login');
    }

}

exports.get_login_test = async (req,res,next) => {
    //console.log("aaa");
    res.render('login', {
        pageTitle: 'Login',
        path: '/login',
        editing: false
    });
}

exports.post_login_test = async (req,res,next) => {
    console.log("entered login");
    //const input = await req.body.sig;
    //console.log(input);
    //if(input==1){
    const username = req.body.usname;
    uname = username;
    const psswd = req.body.psd;
    console.log(username);
    console.log("gghgj");
    console.log(psswd);
    
    const cypher = util.format('match(m:User{username:"%s",Password:"%s"}) return count(m) as val;',username,psswd);
    const resp = await session.run(cypher);
    val1 = resp.records[0].get('val').toInt();
    console.log(val1);
    if(val1==1){
        res.redirect('/home');
    }
    //}
}

global.searched_movie = undefined;
global.searched_genre = undefined;
global.searched_actor = undefined;
global.movie_detail = undefined;
global.movie_present = undefined;
global.movie_detail1 = undefined;

exports.get_home_test = async(req,res,next) => {
    const cypher1 = util.format('match p=(a:Movies) return a.title as title order by a.vote_ratings desc,a.popularity desc');
    // const cypher2 = util.format('match p=(a:Movies)-[r:genre_movie]->(b:genre_movies) where b.genre = "horror" return a.title as title order by a.vote_ratings desc,a.popularity desc');
    // const cypher3 = util.format('match p=(a:Movies)-[r:genre_movie]->(b:genre_movies) where b.genre <> "horror" and b.genre <> "animation" return a.title as title order by a.vote_ratings desc,a.popularity desc');
    const resp1 = await session.run(cypher1);
    // const resp2 = await session.run(cypher2);
    // const resp3 = await session.run(cypher3);
    const now1 = resp1.records;
    // const now2 = resp2.records;
    // const now3 = resp3.records;
    // console.log(now);
    // const similarity = stringSimilarity.compareTwoStrings("%s","%s");
    // console.log(similarity);
    // var matches = stringSimilarity.findBestMatch("healed", [
    //   "edward",
    //   "sealed",
    //   "theatre",
    // ]);
    res.render('home', {
        pageTitle: 'Home',
        path: '/',
        data1 : now1,
        // data2 : now2,
        // data3 : now3,
        editing: false
    });
}


exports.post_home_test = async(req,res,next) => {
    const movie_id = await req.body.movie;
    const genre_id = await req.body.genre;
    const actor_id = await req.body.actor;
    const sig = await req.body.sig;
    // console.log(genre_id);
    if(sig == 1){
        res.redirect('/login');
    }
    if(genre_id != undefined){

    const genre_query = util.format('MATCH p=(a:Movies)-[r:genre_movie]->(b:genre_movies {genre:"%s"}) return a.title as movie_title order by a.popularity desc;',genre_id.toLowerCase());
    const resp = await session.run(genre_query);
    searched_genre = resp.records;
    res.redirect('/recommendations');
    }

    // console.log("Entered this");

    if(movie_id != undefined){
    const simple_movies_query = util.format('MATCH p=(a:Movies {title:"%s"})-[r:genre_movie]->(b:genre_movies)<-[r2:genre_movie]-(c:Movies) where c.title <> "%s" RETURN c.title as movie_title,c.Rrated order by c.vote_ratings desc,c.popularity desc;',movie_id,movie_id);
    const movie_now = util.format('Match (n:Movies) where n.title = "%s" return n.title as movie_title,n.Description as m_description;',movie_id);
    const content_based_query = util.format('match (n1:Movies {title:"%s"})-[r1:Acted_in]->(m:Actor)<-[r2:Acted_in]-(n2:Movies) where n2.title <> "%s" return n2.title as movie_title,n2.popularity as popy,n2.vote_ratings as rates  union match (m1:Movies {title:"%s"})-[s1:directed_in]->(n:Director)<-[s2:directed_in]-(m2:Movies) where m2.title <> "%s" return m2.title as movie_title,m2.popularity as popy,m2.vote_ratings as rates order by rates desc,popy desc;',movie_id,movie_id,movie_id,movie_id);
    const all_movies = util.format('match (n:Movies) where n.title<>"%s" return n.title as movie_title,n.Description as m_description;',movie_id);

    const resp1 = await session.run(movie_now);
    movie_present = resp1.records;
    const resp2 = await session.run(simple_movies_query);
    searched_movie = resp2.records;
    const resp3 = await session.run(all_movies);
    const all_m = resp3.records;
    // console.log(searched_movie[0].get('m_description'));
    const desc_movies = [];
    console.log(all_m);
    for(var i=all_m.length-1;i>=0;i--){
        const descr = all_m[i].get('m_description').toString();

        if(stringSimilarity.compareTwoStrings(descr,movie_present[0].get('m_description')) > 0.42){
            searched_movie.push(all_m[i]);
        }
    }

    // console.log(desc_movies)

    res.redirect('/recommendations');
    }

    if(actor_id != undefined){
    console.log("Entered actor if");
    console.log(actor_id);
    const actor_query = util.format('MATCH p=(a:Movies)-[r:Acted_in]->(b:Actor {name:"%s"}) return a.title as movie_title order by a.popularity desc;',actor_id);
    const resp = await session.run(actor_query);
    searched_actor = resp.records;
    // console.log(searched_actor);
    res.redirect('/recommendations');
    }

    const input = await req.body.signal;
    // console.log(input)

    //watch
    if (input == 1) {
        console.log("aa")
        const title = await req.body.title;
        console.log(title)
        console.log("aa")
        const cypher = util.format('match p = (:User {username:"%s"})-[:Watching]->(:Movies {title:"%s"})RETURN sum(length(p)) as tot;',uname,title)
        const resp = await session.run(cypher);
        console.log("enter here")
        const temp = resp.records
        console.log(temp[0].get('tot').toInt())
        const val = temp[0].get('tot').toInt()
        if(val==0){
            const cypher1 = util.format('match (a:Movies),(b:User) where a.title = "%s" and b.username = "%s" CREATE (b)-[r:Watching]->(a) return r;',title,uname);
            const cypher2 = util.format('match (a:Movies),(b:User) where a.title = "%s" and b.username = "%s" CREATE (b)-[r:Watched]->(a) return r;',title,uname);
            
            const resp1 = await session.run(cypher1);
            const resp2 = await session.run(cypher2);
        }
        //movie_detail = now;
        res.redirect('/watching')
    }
    //view detail
    if (input == 2) {
        console.log("aa")
        const title = await req.body.title;
        console.log(title)
        console.log("aa")

        const cypher = util.format('match (m:Movies{title:"%s"})-[r:Acted_in]->(a:Actor) return m.title as title,a.name as actor,m.Rrated as Rated,m.Duration as Dur,m.vote_ratings as arat;',title);
        const cypher1 = util.format('match (g:genre_movies)<-[:genre_movie]-(m:Movies{title:"%s"}) return g.genre as genre;',title)
        const resp = await session.run(cypher);
        const resp1 = await session.run(cypher1);
        const now = resp.records;
        const now1 = resp1.records;
        console.log("aao")
        console.log(now)
        movie_detail = now;
        movie_detail1 = now1;
        res.redirect('/viewdetail')
    }

    //watchlist
    if (input == 3) {
        console.log("aa")
        const title = await req.body.title;
        console.log(title)
        console.log("aa")
        const cypher = util.format('match p = (:User {username:"%s"})-[:Watchlist]->(:Movies {title:"%s"})RETURN sum(length(p)) as tot;',uname,title)
        const resp = await session.run(cypher);
        console.log("enter here")
        const temp = resp.records
        console.log(temp[0].get('tot').toInt())
        const val = temp[0].get('tot').toInt()
        if(val==0){
            const cypher1 = util.format('match (a:Movies),(b:User) where a.title = "%s" and b.username = "%s" CREATE (b)-[r:Watchlist]->(a) return r;',title,uname);
            const resp1 = await session.run(cypher1);
        }
        //movie_detail = now;
        res.redirect('/watchlist')
    }
}

// console.log(searched_movie);

exports.get_recommendations_test = async(req,res,next) => {
    const movies = await searched_movie;
    const movie_s = await movie_present;
    const genres = await searched_genre;
    const actors = await searched_actor;

    // console.log("movies------->",movies);
    // console.log("genres------->",genres);
    // console.log("actors------->",actors);


    if(movies != undefined){
    res.render('recommendations', {
        pageTitle: 'Recommendations',
        path: '/',
        data1 : movies,
        data2 : movie_s
    });
    searched_movie = undefined;
    }

    if(genres != undefined){
    res.render('recommendations', {
        pageTitle: 'Recommendations',
        path: '/',
        data1 : genres,
        data2 : []
    });  
    searched_genre = undefined;  
    }

    if(actors != undefined){
    res.render('recommendations', {
        pageTitle: 'Recommendations',
        path: '/',
        data1 : actors,
        data2 : []
    });
    searched_actor = undefined;
    }
}


exports.get_detail_test = async(req,res,next) => {
    console.log("printing");
    const now = movie_detail;
    const now1 = movie_detail1;
    console.log(now);
    console.log(now1);
    res.render('viewdetail', {
        pageTitle: 'View Detail',
        path: '/',
        data : now,
        data1 : now1
    });
}

exports.get_watching_test = async(req,res,next) => {
    const cypher = util.format('MATCH (u:User{username:"%s"})-[r:Watching]->(m:Movies) RETURN m.title as movie_title;',uname);
    const resp = await session.run(cypher);
    const now = resp.records;
    // console.log(now);
    res.render('watching', {
        pageTitle: 'Watching',
        path: '/',
        data : now,
        editing: false
    });
}


exports.post_watching_test = async(req,res,next) => {
    const input = await req.body.signal;
    console.log("enter")
    console.log(input)

    if (input == 1) {
        //console.log("aa")
        const title = await req.body.title;
        //console.log(title)
        //console.log("aa")
        const cypher = util.format('match (m:Movies{title:"%s"})-[r:Acted_in]->(a:Actor) return m.title as title,a.name as actor,m.Rrated as Rated,m.Duration as Dur,m.average_ratings as arat;',title);
        const resp = await session.run(cypher);
        const now = resp.records;
        //console.log(now)
        movie_detail = now;
        res.redirect('/viewdetail')
    }

    if (input == 2) {
        //console.log("aa")
        const title = await req.body.title;
        //console.log(title)
        //console.log("aa")
        const cypher = util.format('MATCH (:User {username:"%s"})-[r:Watching]->(p:Movies{title:"%s"}) DELETE r;',uname,title);
        const resp = await session.run(cypher);
        res.redirect('/watching')
    }
}

exports.get_watchlist_test = async(req,res,next) => {
    const cypher = util.format('MATCH (u:User{username:"%s"})-[r:Watchlist]->(m:Movies) RETURN m.title as movie_title;',uname);
    const resp = await session.run(cypher);
    const now = resp.records;
    // console.log(now);
    res.render('watchlist', {
        pageTitle: 'Watchlist',
        path: '/',
        data : now,
        editing: false
    });
}


exports.post_watchlist_test = async(req,res,next) => {
    const input = await req.body.signal;
    //console.log("enter")
    //console.log(input)

    if (input == 1) {
        //console.log("aa")
        const title = await req.body.title;
        //console.log(title)
        //console.log("aa")
        const cypher = util.format('match (m:Movies{title:"%s"})-[r:Acted_in]->(a:Actor) return m.title as title,a.name as actor,m.Rrated as Rated,m.Duration as Dur,m.vote_ratings as arat;',title);
        const resp = await session.run(cypher);
        const now = resp.records;
        //console.log(now)
        movie_detail = now;
        res.redirect('/viewdetail')
    }
    console.log(input)
    if (input == 2) {
        //console.log("aa")
        const title = await req.body.title;
        //console.log(title)
        //console.log("aa")
        const cypher = util.format('MATCH (:User {username:"%s"})-[r:Watchlist]->(p:Movies{title:"%s"}) DELETE r;',uname,title);
        const resp = await session.run(cypher);
        res.redirect('/watchlist')
    }
}

exports.get_friend_request_test = async(req,res,next) => {
    const cypher = util.format('MATCH (b:User)-[r:Follows{status:"Request Sent"}]->(a:User {username:"%s"}) return b.username as username,b.Name as name;',uname);
    const resp = await session.run(cypher);
    const now = resp.records;
    console.log(now);
    res.render('friend_request', {
        pageTitle: 'Friend Requests',
        path: '/',
        data : now,
    });   
}

exports.post_friend_request_test = async(req,res,next) => {
    const input=req.body.signal;
    const user_name=req.body.user;
    console.log(user_name);
    console.log(input);

    if (input==2){
        console.log("Entered here 2");
        const cypher = util.format('MATCH (a:User {username:"%s"})-[r:Follows]->(b:User {username:"%s"}) SET r.status="friends";',user_name,uname);
        const resp = await session.run(cypher);
        res.redirect('/friend_request');
    }
    else if (input==3){
        console.log("Entered here 3");
        const cypher = util.format('MATCH (a:User {username:"%s"})-[r:Follows]->(b:User {username:"%s"}) DELETE r;',user_name,uname);
        const resp = await session.run(cypher);
        res.redirect('/friend_request');
    }
}


exports.get_profile_test = async(req,res,next) => {
    const cypher = util.format('MATCH (a:User {username:"%s"}) return a.username as username,a.Name as Name,a.DOB as dob,a.Gender as gender,a.Country as country;',uname);
    const resp = await session.run(cypher);
    const now = resp.records;

    res.render('profile',{
        pageTitle: 'profile',
        path : '/',
        data : now
    });
}

exports.post_profile_test = async(req,res,next) => {
    const user_name1 = req.body.username;
    const name1 = req.body.name;
    const dob1  = req.body.dob;
    const gender1 = req.body.gender;
    const country1 = req.body.country;

    // console
    console.log("Entered Profile");
    // console.log(dob1);
    console.log(gender1);

    const input=req.body.signal;

    // if (user_name1!=undefined){
    //     const cypher = util.format('MATCH (a:User {username:"%s"}) SET User.username="%s;',user_name1);
    //     const resp = await session.run(cypher);
    // }

    if (name1!=undefined){
        const cypher = util.format('MATCH (a:User {username:"%s"}) SET a.Name="%s";',uname,name1);
        const resp = await session.run(cypher);
    }

    if (dob1!=undefined){
        const cypher = util.format('MATCH (a:User {username:"%s"}) SET a.DOB="%s";',uname,dob1);
        const resp = await session.run(cypher);
    }

    if (gender1!=undefined){
        const cypher = util.format('MATCH (a:User {username:"%s"}) SET a.Gender="%s";',uname,gender1);
        const resp = await session.run(cypher);
    }

    if (country1!=undefined){
        const cypher = util.format('MATCH (a:User {username:"%s"}) SET a.Country="%s";',uname,country1);
        const resp = await session.run(cypher);
    }

    res.redirect('/profile') 
}

// global.friend_id = undefined;
global.friend_name = undefined;
global.temp = undefined;
global.searched_friend = undefined;

exports.get_friends_test = async(req,res,next) => {
    // console.log(uname);
    const cypher = util.format('MATCH (a:User)-[r:Follows{status:"friends"}]->(b:User) where a.username ="%s" return b.username as username,b.Name as name;',uname);
    const resp = await session.run(cypher);
    const now = resp.records;

    console.log(now);

    res.render('friends',{
        pageTitle: 'friends',
        path : '/',
        data : now,
        editing: false
    });
}



exports.post_friends_test = async(req,res,next) => {
    const user_name = req.body.username;
    const signal = req.body.signal;
    const friend = req.body.friend;
    friend_name = friend;

    searched_name = user_name;

    if(signal == 1){
        res.redirect('/recommend');
    }
    else{
        const cypher = util.format('MATCH (a:User {username:"%s"})-[rel:Follows]->(b:User {username: "%s"}) return b.username as username,b.Name as name,rel.status as status;',user_name,uname);
        const resp = await session.run(cypher);
        const now = resp.records;

        const cypher1 = util.format('MATCH (a:User {username:"%s"})-[rel:Follows]->(b:User {username: "%s"}) return b.username as username,b.Name as name,rel.status as status;',uname,user_name);
        const resp1 = await session.run(cypher1);
        const now1 = resp1.records;
        // if(now1 != undefined){friend_info2 = now1[0].get('username');}
        temp = 0;
        if(now.length != 0){
                console.log("Entered if");
                if(now[0].get('status')=='friends'){
                    temp = 1; //{the other party's request accepted}
                }
                else{
                    temp = 2; //{friend request sent by the other party but didnot accept}
                }
            }
        else if(now1.length != 0){
                // console.log("Else loop")
                if(now1[0].get('status')=="friends"){
                    temp = 1; //{the other party's request accepted}
                }
                else{
                    temp = 4; //{friend request sent by me but didnot accept}
                }
            } 
            res.redirect('/searched_friend'); 
        }
}


exports.get_searched_friend_test = async(req,res,next) => {
    const bool_var = temp;
    const friend = searched_name;
    // console.log(friend);
    res.render('searched_friend',{
        pageTitle: 'searched_friend',
        path : '/',
        data : bool_var,
        data1: friend
        // editing: false
    });
}

exports.post_searched_friend_test = async(req,res,next) => {
    const signal = req.body.signal;
    const friend = req.body.friend;
    console.log("print something");
    console.log(signal);
    

    if(signal == 0){
        const query = util.format('MATCH (a:User),(b:User) where a.username= "%s" and b.username = "%s" CREATE (a)-[r:Follows{status:"Request Sent"}]->(b) return r;',uname,friend);
        const resp = await session.run(query);
    }
    else if(signal == 2){
        const query = util.format('match (a:User)-[r:Follows]->(b:User) where a.username="%s" and b.username = "%s" set r.status = "friends";',friend,uname);
        const resp = await session.run(query);
    }
    res.redirect('/friends');

}



exports.get_watched_test = async (req,res,next) => {

    const cypher = util.format('MATCH (u:User{username:"%s"})-[r:Watched]->(m:Movies) RETURN m.title as movie_title,m.vote_ratings as ratings;',uname);
    const resp = await session.run(cypher);
    const now = resp.records;
    res.render('recommend_movies', {
        pageTitle: 'Recommend',
        path: '/',
        data : now,
        friend_n:friend_name,
        editing: false
    });

};

exports.post_watched_test = async (req,res,next) => {
    // const movie_id = req.body.user_name;
    const movie_name = req.body.name;
    const friend_name = req.body.friend
    const query = util.format('match (a:User {username:"%s"}),(b:User {username:"%s"}) create (a)-[:Recommend {movie:"%s"}]->(b);',uname,friend_name,movie_name)
    await session.run(query);
    res.redirect('/recommend');
};


// exports.get_logout_test = async (req,res,next) => {

// }

// exports.post_logout_test = async (req,res,next) => {
    
// }

exports.get_recomfriend_test = async (req,res,next) => {

    const cypher = util.format('match (a:User)-[r:Recommend]->(b:User) where b.username = "%s" return a.username as friend,r.movie as movie_title;',uname);
    const resp = await session.run(cypher);
    const now = resp.records;
    res.render('recomfriend', {
        pageTitle: 'Recommendations from Friends',
        path: '/',
        data : now,
        editing: false
    });

};
