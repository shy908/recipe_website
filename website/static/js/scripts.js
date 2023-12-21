window.addEventListener('DOMContentLoaded', () => {
    animateMobileMenu();
    animateHeaderOnScroll();
    displayAvatar();
    populatePageWithMediaPosts();
    scrollToTop();
    footerCollapseAccordion();
    checkForRecipeDescription();
    dashboardSearchFilter();
    dashboardData();
    dashboardTableDataAccordion();
    searchForm();
    adjustSearchResultsContainer();
    handleBlankSearch();
});

const Constants = {
    URL: location.origin,
    INTERVAL: 1000
};

const animateMobileMenu = () => {
    let navRightMenuIcon = document.querySelector('.nav_right_menu_icon');
    let navRightList = document.querySelector('.navigation .nav_right ul');
    if(navRightMenuIcon != undefined){
        navRightMenuIcon.addEventListener('click', () => {
            navRightMenuIcon.classList.toggle('menu_icon_active');
            navRightList.classList.toggle('navigation_active');
        });
    }
}

const animateHeaderOnScroll = () => {
    let timer = null;
    let header = document.querySelector('#siteHeader');
    let headerBounds = header.getBoundingClientRect();

    window.addEventListener('scroll', () => {
        if(window.pageYOffset > headerBounds.bottom){
            if(timer !== null){
                header.classList.remove('animate-header');
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                header.classList.add('animate-header');
            }, 500);
        }else if (window.pageYOffset <= headerBounds.bottom) {
            header.classList.remove('animate-header');
        }
    }, false);
}

const displayAvatar = () => {
    const globalUserName = document.querySelector('[name="global_username"]');
    if ( globalUserName != undefined ) {
        const name = globalUserName.value;
        const avatar = document.querySelector('.avatar');
        avatar.textContent = name.charAt(0).toUpperCase();
        avatar.setAttribute('title', `Logged in as ${name}`);
    }
}

const populatePageWithMediaPosts = () => {

    const mediaPosts = document.querySelector('.media_posts');
    const mediaItemsCount = document.querySelector('.media_items_count');

    if(mediaPosts != undefined){
        fetch(`${Constants.URL}/media-posts`)
        .then(res => res.json())
        .then(posts => {

            //console.log(posts);

            mediaItemsCount.innerHTML = `
                <span>Showing ${posts.length} results</span>
            `;

            for (const post of posts) {
                
                let recipeCard = document.createElement('div');
                recipeCard.className = 'recipe_card';

                let fileType = (post.fields['file_type'] !== null) ? post.fields['file_type'] : '';
                let formattedDate = post.fields['date_created'].split('T')[0];
                let fileSizeInMB = post.fields['file_size'] / (1024 ** 2);
                let mediaClassName = '';

                // prepare class selectors based on file type
                if ( fileType.match(/image/g) ) {
                    mediaClassName = 'recipe_image';
                } else if ( fileType.match(/video/g) ) {
                    mediaClassName = 'recipe_video';
                } else if ( fileType.match(/application/g) ) {
                    mediaClassName = 'recipe_application';
                } else {
                    mediaClassName = 'recipe_no_media';
                }

                recipeCard.innerHTML = `
                    ${fileType !== null
                    ? `<div class="recipe_media ${mediaClassName}">${post.fields['file_path'] ? `<a class="btn-download" href="${post.fields['file_path']}" title="${post.fields['file_name']}" aria-label="Link to download recipe file" download="${post.fields['file_name']}">Download</a>`: ``}<span>${formattedDate}</span></div>` 
                    : `<div class="recipe_media ${mediaClassName}"><span>${formattedDate}</span></div>`}
                    <div class="recipe_title"><span>${post.fields['title']}</span></div>
                    <div class="recipe_description"><p>${post.fields['description'].length > 30 ? `${post.fields['description'].substring(0, 30)}...`: post.fields['description']}</p></div>
                    <div class="recipe_information">
                        <div class="recipe_information_row">
                            <strong>File Size</strong>
                            <span>${post.fields['file_size'] !== null ? `${fileSizeInMB.toFixed(2)}MB` : `0.00MB`}</span>
                        </div>
                        <div class="recipe_download_row">
                            <a class="btn-view" href="recipe/${post.pk}" title="${post.fields['file_name']}" aria-label="Link to view recipe information">View</a>
                        </div>
                    </div>

                `;

                mediaPosts.appendChild(recipeCard);

            }
        })
        .catch(err => console.log(err));
    }
}

const scrollToTop = () => {

    const scrollToTopButton = document.querySelector('.scroll_to_top');

    window.addEventListener('scroll', () => {

        if ( (window.innerHeight + window.pageYOffset) >= document.body.scrollHeight ) {
            scrollToTopButton.classList.add('show_scroll_button');
        } else {
            scrollToTopButton.classList.remove('show_scroll_button');
        }
    });

    if (scrollToTopButton != undefined) {
        scrollToTopButton.addEventListener('click', () => {
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                })
            }, Constants.INTERVAL / 3);
        });
    }
};

const footerCollapseAccordion = () => {

    ['load','resize'].forEach(event => {

        window.addEventListener(event, () => {

            if (window.innerWidth < 768){

                let footerTopSegmentHeadings = document.querySelectorAll('.footer_top_segment h3');

                if ( footerTopSegmentHeadings != undefined ) {

                    footerTopSegmentHeadings.forEach(footerTopSegmentHeading => {

                        footerTopSegmentHeading.addEventListener('click', () => {
                        
                            let sibling = footerTopSegmentHeading.nextElementSibling;
    
                            if (sibling.style.maxHeight){
                                sibling.style.maxHeight = null;
                            }else{
                                sibling.style.maxHeight = `${sibling.scrollHeight}px`;
                            }
                            
                        });

                    });
                }
            }
        })
    });
}

const checkForRecipeDescription = () => {
    const recipeProfileDescriptionParagraph = document.querySelector('.recipe_profile_description p');
    if(recipeProfileDescriptionParagraph != undefined){
        if ( recipeProfileDescriptionParagraph.textContent.length > 0 ) {
            recipeProfileDescriptionParagraph.classList.add('recipe_description');
        }
    }
}

const dashboardSearchFilter = () => {
    const dashboardBottomUserPosts = document.querySelector('.dashboard_bottom_user_posts');
    
    if ( dashboardBottomUserPosts != undefined ) {

        dashboardBottomUserPosts.addEventListener('keyup', (e) => {

            let postsSearchFilter = e.currentTarget.querySelector('[name="posts_search_filter"]');
            
            let searchContent = postsSearchFilter.value.toLowerCase();

            let dashboardUserPostsLists = e.currentTarget.querySelectorAll('.dashboard_user_posts_lists .post_list');

            dashboardUserPostsLists.forEach(dashboardUserPost => {

                let postContent = dashboardUserPost.textContent.toLowerCase();

                if ( postContent.indexOf(searchContent) > -1 ) {

                    dashboardUserPost.style.display = '';

                } else {

                    dashboardUserPost.style.display = 'none';

                }
            });
        });
    } 
}

const dashboardData = () => {

    let totalPostsArray = [];
    let userPostsArray = [];
    let activePostsArray = [];
    let chartDataArray = [];
    let chartLabels = ['Recipes','Your Recipes'];
    let chartColors = [
        '#CC0000',
        '#orange'
    ];

    const dashboardTop = document.querySelector('.dashboard_top');
    const dashboardBottom = document.querySelector('.dashboard_bottom');

    if ( dashboardTop != undefined || dashboardBottom != undefined ) {

        const globalUsername = document.querySelector('[name="global_username"]');
        const globalUsernameId = document.querySelector('[name="global_userid"]');
        const dashboardStats = document.querySelector('#dashboardStats');
        const dashboardStatsInfo = document.querySelector('.dashboard_stats_info');
        const dashboardUserPostsLists = document.querySelector('.dashboard_user_posts_lists');

        dashboardTop.innerHTML = `
            <div class="dashboard_content">
                <div class="dashboard_top_avatar">
                    <p>Currently logged in as <span>${globalUsername.value}</span</p>
                </div>
                <div class="dashboard_top_links">
                    <a href="/" title="Home" aria-label="Link to homepage">Home</a>
                    <a href="/upload" title="Upload" aria-label="Link to upload recipe">Upload</a>
                    <a href="/logout" title="Logout" aria-label="Logout">Logout</a>
                </div>
            </div>
        `;

        fetch(`${Constants.URL}/dashboard-data`)
        .then(res => res.json())
        .then(posts => {

            for(const post of posts){

                if ( parseInt(globalUsernameId.value) === post['fields']['uploader'] ) {
                    userPostsArray.push(1);

                    const postList = document.createElement('section');
                    if (post['fields']['file_status'] == 0) {
                        postList.className = 'post_list inactive_post';
                    }else{
                        postList.className = 'post_list';
                    }
                    postList.innerHTML = `
                        <div class="post_header">${post['fields']['title']}</div>
                        <div class="post_data">
                            <span class="post_desc">${post['fields']['description'] !== null ? `${post['fields']['description'].substring(0, 15)}...` : ''}</span>
                            <span class="post_file_name">${post['fields']['file_name'] !== null ? `${post['fields']['file_name'].substring(0, 15)}...` : ''}</span>
                            <span class="post_file_path">${post['fields']['file_path'] !== null ? `${post['fields']['file_path'].substring(0, 15)}...` : ''}</span>
                            <span class="post_file_size">${post['fields']['file_size'] !== null ? `${(post['fields']['file_size'] / (1024 ** 2)).toFixed(2)}MB` : ''}</span>
                            <div class="post_data_controls">
                                <a class="txt_align_reset" href="/edit-recipe/${post['pk']}">Edit</a>
                                <a class="txt_align_reset" href="/delete-recipe/${post['pk']}">Delete</a>
                                ${post['fields']['file_status'] === 0 ? `<a class="txt_align_reset" href="/activate-recipe/${post['pk']}">Activate</a>` : ''}
                            </div>
                        </div>
                    `;

                    setTimeout(() => {
                        dashboardUserPostsLists.appendChild(postList);
                    }, Constants.INTERVAL);

                } else {
                    totalPostsArray.push(1);
                }

                if ( post['fields']['file_status'] === 1 ) {
                    activePostsArray.push(1);
                }

            }

            chartDataArray.push(( totalPostsArray.length / posts.length ) * 100);
            chartDataArray.push(( userPostsArray.length / posts.length ) * 100);

            setTimeout(() => {
                new Chart(dashboardStats,{
                    type: "doughnut",
                    data: {
                        labels: chartLabels,
                        datasets: [{
                            backgroundColor: chartColors,
                            data: chartDataArray
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        aspectRatio: 1,
                        title: {
                            display: true,
                            text: "Statistics"
                        }
                    }
                })
            }, Constants.INTERVAL);

            let totalPosts = posts.length;
            let totalPostsPercent = `${((totalPostsArray.length / posts.length) * 100).toFixed(2)}%`;
            let userPostsPercent = `${((userPostsArray.length / posts.length) * 100).toFixed(2)}%`;
            let activePosts = activePostsArray.length;
            let inactivePosts = totalPosts - activePosts;

            dashboardStatsInfo.innerHTML = `
                <div class="dashboard_stats_info_row"><span>Total Recipes</span><span>${totalPosts}</span></div>
                <div class="dashboard_stats_info_row"><span>Other Recipes</span><span>${totalPostsPercent}(${posts.length - userPostsArray.length})</span></div>
                <div class="dashboard_stats_info_row"><span>Your Recipes</span><span>${userPostsPercent}(${userPostsArray.length})</span></div>
                <div class="dashboard_stats_info_row"><span>Total Active Recipes</span><span>${activePosts}</span></div>
                <div class="dashboard_stats_info_row"><span>Total Inactive Recipes</span><span>${inactivePosts}</span></div>
            `;
        })
        .catch(err => console.log(err));

    }
}

const dashboardTableDataAccordion = () => {
    const dashboardUserPostsLists = document.querySelector('.dashboard_user_posts_lists');

    ['load','resize'].forEach(event => {
        window.addEventListener(event, () => {
            
            if ( dashboardUserPostsLists != undefined ) {

                dashboardUserPostsLists.addEventListener('click', (e) => {
        
                    let postHeader = e.target;
                    let postHeaderSibling = postHeader.nextElementSibling;

                    if ( window.innerWidth <= 767 ) {

                        if (postHeaderSibling.style.maxHeight){
                            postHeaderSibling.style.maxHeight = null;
                        } else {
                            postHeaderSibling.style.maxHeight = `${postHeaderSibling.scrollHeight}px`;
                        }
                    }
        
                });
            }

        });
    });
}

const searchForm = () => {

    const text = document.querySelector('[name="text"]');
    const searchReciperWrapper = document.querySelector('.search_recipe_wrapper');
    const searchRecipeLinksList = document.querySelector('.search_recipe_links_list');
    const showResultsFormText = document.querySelector('#showResultsForm [name="text"]');

    let suggestedResultsMap = new Map();

    if(text != undefined){
        
        text.addEventListener('keyup', (e) => {

            let searchValue = text.value;
            
            if (e.code === 'Enter' || e.code === 'Space') {

                e.preventDefault();
                return false;

            } else {

                if ( searchValue.length >= 2 ) {
    
                    searchReciperWrapper.style.display = "block";
                    
                    showResultsFormText.value = searchValue;
    
                    fetch(`${Constants.URL}/search-data?` + new URLSearchParams({
                        text: searchValue
                    }))
                    .then(res => res.json())
                    .then(search => { 
                        
                        for(let i = 0; i < 5; i++){
    
                            let recipe = search[i];

                            if ( recipe != undefined ){
                                suggestedResultsMap.set(recipe['pk'], recipe['fields']['title']);
                            }
    
                        }
                        
                     })
                    .catch(err => console.log(err));

                    searchRecipeLinksList.innerHTML = ``;
    
                    for (const [key,value] of suggestedResultsMap.entries()) {
    
                        const a = document.createElement('a');
                        a.className = 'txt_align_reset search_link';
                        a.href = `/recipe/${key}`;
                        a.textContent = `${value}`;

                        searchRecipeLinksList.appendChild(a);
                    }
    
                } else {
    
                    searchReciperWrapper.style.display = "none";

                    showResultsFormText.value = '';
    
                    searchRecipeLinksList.innerHTML = ``;

                    suggestedResultsMap.clear();
    
                }

            }

        })
    }
}

const adjustSearchResultsContainer = () => {

    const searchResults = document.querySelector('.search_results');
    const headerSearchForm = document.querySelector('#headerSearchForm');

    if ( searchResults != undefined ) {

        const header = document.querySelector('header');

        ['load','resize'].forEach(event => {
            window.addEventListener(event, () => {

                const headerBounds = header.getBoundingClientRect();
                searchResults.style.top = `${headerBounds.bottom}px`;

                const headerSearchFormBounds = headerSearchForm.getBoundingClientRect();
                searchResults.style.maxWidth = `${headerSearchFormBounds.width}px`;
            });
        })
    }
}

const handleBlankSearch = () => {

    const headerSearchFormText = document.querySelector('#headerSearchForm [name="text"]');
    const btnSearchIcon = document.querySelector('.btn-search-icon');

    if ( headerSearchFormText != undefined && btnSearchIcon ) {
        btnSearchIcon.addEventListener('click', () => {
            
            if ( headerSearchFormText.value === '') {
                headerSearchFormText.value = 'blank';
            }
        });
    }
}