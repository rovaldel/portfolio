document.addEventListener('DOMContentLoaded', () => {
    const blogContainer = document.getElementById('blog-posts-container');
    const loader = document.getElementById('loader');
    const paginationContainer = document.getElementById('pagination-container');
    const postsPerPage = 3;
    let currentPage = 1;
    let posts = [];

    const fetchPosts = async () => {
        console.log('Fetching posts...');
        try {
            loader.style.display = 'block';
            const response = await fetch('https://n8n.rodrigovaldelvira.com/webhook/posts');
            console.log('Raw response:', response);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Parsed JSON data:', data);
            posts = data;
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            console.log('Sorted posts:', posts);
            renderPosts();
        } catch (error) {
            blogContainer.innerHTML = '<p>No se encontraron artículos.</p>';
            console.error('There has been a problem with your fetch operation:', error);
        } finally {
            loader.style.display = 'none';
        }
    };

    const renderPosts = () => {
        blogContainer.innerHTML = '';
        const start = (currentPage - 1) * postsPerPage;
        const end = start + postsPerPage;
        const paginatedPosts = posts.slice(start, end);
        console.log('Paginated posts:', paginatedPosts);

        paginatedPosts.forEach(post => {
            console.log('Rendering post:', post);
            const postElement = document.createElement('div');
            postElement.classList.add('col-md-4', 'd-flex');
            const postDate = new Date(post.date);
            const formattedDate = postDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            postElement.innerHTML = `
                <div class="blog-entry justify-content-end">
                    <div class="text mt-3 float-right d-block">
                        <h3 class="heading"><a href="post.html?id=${post.id}">${post.title}</a></h3>
                        <div class="d-flex align-items-center mb-3 meta">
                            <p class="mb-0">
                                <span class="mr-2">${formattedDate}</span>
                                <a href="#" class="mr-2">${post.author}</a>
                            </p>
                        </div>
                        <p>${post.content.substring(0, 200)}...</p>
                        <p><a href="post.html?id=${post.id}" class="btn btn-primary">Ver más</a></p>
                    </div>
                </div>
            `;
            blogContainer.appendChild(postElement);

            // Manually trigger animation
            setTimeout(() => {
                $(postElement).addClass('item-animate');
                setTimeout(() => {
                    const effect = $(postElement).data('animate-effect');
                    if (effect === 'fadeIn') {
                        $(postElement).addClass('fadeIn ftco-animated');
                    } else if (effect === 'fadeInLeft') {
                        $(postElement).addClass('fadeInLeft ftco-animated');
                    } else if (effect === 'fadeInRight') {
                        $(postElement).addClass('fadeInRight ftco-animated');
                    } else {
                        $(postElement).addClass('fadeInUp ftco-animated');
                    }
                    $(postElement).removeClass('item-animate');
                }, 50);
            }, 100);
        });
        renderPagination();
        AOS.refresh();
    };

    const renderPagination = () => {
        paginationContainer.innerHTML = '';
        const pageCount = Math.ceil(posts.length / postsPerPage);

        if (pageCount > 1) {
            const prevButton = document.createElement('button');
            prevButton.innerText = 'Anterior';
            prevButton.disabled = currentPage === 1;
            prevButton.addEventListener('click', () => {
                if (currentPage > 1) {
                    currentPage--;
                    renderPosts();
                }
            });
            paginationContainer.appendChild(prevButton);

            const nextButton = document.createElement('button');
            nextButton.innerText = 'Siguiente';
            nextButton.disabled = currentPage === pageCount;
            nextButton.addEventListener('click', () => {
                if (currentPage < pageCount) {
                    currentPage++;
                    renderPosts();
                }
            });
            paginationContainer.appendChild(nextButton);
        }
    };

    fetchPosts();
});