// document.addEventListener( 'DOMContentLoaded', function() {
//     var containers = document.querySelectorAll('[]');
//     var cursor = document.querySelector('.cursor');
//
//     document.addEventListener('mousemove', function(e) {
//         cursor.style.left = e.clientX + 'px';
//         cursor.style.top = e.clientY + 'px';
//     });
//
//     containers.forEach(function(container) {
//         container.addEventListener('mouseenter', function(){
//             cursor.style.display = "block";
//             cursor.style.height = "80px";
//             cursor.style.width = "80px";
//             cursor.style.left = "-50%";
//             cursor.style.top = "-50%";
//             cursor.style.transition = "0.1s";
//         });
//         container.addEventListener('mouseleave', function(){
//             cursor.style.display = "none";
//             cursor.style.height = "0px";
//             cursor.style.width = "0px";
//             cursor.style.left = "-50%";
//             cursor.style.top = "-50%";
//             cursor.style.transition = "0.1s";
//         });
//     });
//
// });
let currentPage = 1;
const ACCESS_KEY = 'PU3ADRlZJxd7BfdhEgCARvTf-riIwpNtdfOxUQhzEkg';
const BASE_URL = 'https://api.unsplash.com';
const searchEndpoint = '/search/photos';
let searchQuery = 'nature';

document.addEventListener( "DOMContentLoaded", () =>
{
    document.getElementById( 'load-more' ).addEventListener( 'click', () =>
    {
        currentPage++;
        showLoader();
        getUnsplashImages( searchQuery );
    } );

    scrollFunction();
} );


function topFunction()
{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

function scrollFunction()
{
    let mybutton = document.getElementById( "toTop" );
    if( document.body.scrollTop > 20 || document.documentElement.scrollTop > 20 )
    {
        mybutton.classList.remove( "hidden" );
    }
    else
    {
        mybutton.classList.add( "hidden" );
    }
}

function getUnsplashImages( query = 'nature' )
{
    const params = new URLSearchParams( {
        query,
        page: currentPage,
        per_page: 9
    } );

    const headers = {
        'Authorization': `Client-ID ${ ACCESS_KEY }`
    };
    searchQuery = query;

    const url = new URL( BASE_URL + searchEndpoint );
    url.search = params;

    fetch( url, { headers } )
        .then( response =>
        {
            if( !response.ok )
            {
                throw new Error( `HTTP error! status: ${ response.status }` );
            }
            return response.json();
        } )
        .then( data =>
        {
            console.log( 'Success:', data );
            loadMoreImages( data.results );
            hideLoader();

            //find number of images in gallery, if the number is less than data.results.length, show no load more
            const gallery = document.querySelector( '.gallery' );
            console.log( gallery.childElementCount );
            console.log( data.total );
            if ( data.results.length === 0 ) {
                hideLoadMore();
                showNoResults();
            }
            else
            {
                showLoadMore();
            }

        } )
        .catch( error =>
        {
            console.error( 'Error:', error.message );
        } );
}

function loadMoreImages( results )
{
    const gallery = document.querySelector( '.gallery' );
    results.forEach( image =>
    {
        const img = document.createElement( 'img' );
        img.src = image.urls.regular;
        gallery.appendChild( img );
        img.addEventListener( 'click', () => createAndShowFullscreenImage( image.urls.regular ) );
    } );
}


function searchImages()
{
    const query = document.getElementById( 'search' ).value;
    emptyGallery();
    showLoader();

    if( query )
    {
        currentPage = 1;
        searchQuery = query;

        hideNoResults();
        hideTypeSomething();

        getUnsplashImages( query );
        scrollToSearch();
    }
    else
    {
        showTypeSomething();
        hideLoadMore();
        hideLoader();
    }
}

function createAndShowFullscreenImage( src )
{
    const fullscreen = document.createElement( 'div' );
    fullscreen.classList.add( 'fullscreen' );
    const img = document.createElement( 'img' );
    img.src = src;
    fullscreen.appendChild( img );
    document.body.appendChild( fullscreen );
    fullscreen.addEventListener( 'click', () =>
    {
        fullscreen.remove();
    } );
}


function emptyGallery()
{
    const gallery = document.querySelector( '.gallery' );
    gallery.innerHTML = '';
}

function hideNoResults()
{
    const noResultsFound = document.querySelector( '.no-results' );
    noResultsFound.style.display = 'none';
}

function showNoResults()
{
    const noResultsFound = document.querySelector( '.no-results' );
    noResultsFound.style.display = 'block';
}

function showTypeSomething()
{
    const typeSomething = document.querySelector( '.type-something' );
    typeSomething.style.display = 'block';
}

function hideTypeSomething()
{
    const typeSomething = document.querySelector( '.type-something' );
    typeSomething.style.display = 'none';
}

function showLoadMore()
{
    const loadMore = document.querySelector( '.load-more' );
    loadMore.style.display = 'flex';
}

function hideLoadMore()
{
    const loadMore = document.querySelector( '.load-more' );
    loadMore.style.display = 'none';
}

function scrollToSearch()
{
    const search = document.getElementById( 'gallery' );
    search.scrollIntoView( { behavior: 'smooth' } );
}

function hideLoader()
{
    const loader = document.querySelector( '.loader' );
    loader.style.display = 'none';
}

function showLoader()
{
    const loader = document.querySelector( '.loader' );
    loader.style.display = 'block';
}
