// Created by Rylan Baun
// Created March 11, 2024
// Purpose: Render all resource related pages


/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Helper Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// load many resources in All-Resources section
const loadAllResources = (response) => {
  pageCleanup();
  renderResources("#all-resources", response.resources);
  $('#all-resources').prepend($(`<h1>Grow Your Nest</h1>`));
};

// load homepage
const loadHomepage = (response) => {
  pageCleanup();
  renderResources("#all-resources", response.resources);
  $('#all-resources').prepend($('<h1>Check Out Whats New</h1>'));
};

// load single resource in Single-Resource section
const loadSingleResource = (response) => {
  pageCleanup();
  checkUserRated(response);
  renderSingleResource('#section-single-resource', response.resource);
  renderComments('#section-single-resource', response.comments);
};

const loadForm = (destination, markup, response) => {
  pageCleanup();
  $(destination).append(markup(response.resource));
  showCategoryOptions(response);
  showResourceTypeOptions(response);
};

// renders all resources in array at destination
const renderResources = (destination, resourceArr) => {
  resourceArr.forEach(resource => {
    $(destination).append(resourceMarkup(resource));
  });
};

// renders single resource at destination
const renderSingleResource = (destination, resource) => {
  $(destination).prepend(resourceMarkup(resource));
  $(destination).append(singleResourceAppendixMarkup());
  $(destination).append($commentForm);
};

//Adds categories to the dropdown
const showCategoryOptions = (response) => {
  response.categories.forEach(category => {
    $("#category-dropdown").append(categoryMarkup(category));
  });
};

//Adds resource_types to the dropdown
const showResourceTypeOptions = (response) => {
  response.resource_types.forEach(resource_type => {
    $("#resource_type-dropdown").append(resourceTypeMarkup(resource_type));
  });
};

// Renders comments for a single resource at destination
const renderComments = (destination, comments) => {
  comments.forEach((comment) => {
    $(destination).append(commentMarkup(comment));
  });
};

// check if user has rated resource, hides rating option is so.
const checkUserRated = ((response) => {
  const resource_id = response.resource.id;
  $.ajax({
    method: 'GET',
    url: `api/users/rated/${resource_id}`,
  })
    .done((response) => {
      if (response) {
        $('#rating-stars').addClass('hidden');
      }
    });
});

// checks if ratings exist, returns correct value depending
const checkRatingsExist = (avg_rating) => {
  let resource_ratings;
  if (!avg_rating) {
    resource_ratings = "No Ratings Yet";
  } else {
    resource_ratings = avg_rating;
  };
  return resource_ratings;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Markups
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// generates resource card and returns it to be rendered, given a resource object input
const resourceMarkup = (resource) => {
  const resource_ratings = checkRatingsExist(resource.avg_rating);
  const $resource = $(`
  <article id="resource-${resource.id}" class="card"">
  <a href="${resource.url}" class="btn btn-primary">Launch In New Tab</a>
  <section id="resource-link" class="card-body">
  <aside>
  <i class=${resource.icon_link}></i>
  </aside>
  <div id="card-text">
  <header>
  <h2 class="card-title">${resource.name}</h2>
  <div>
  <h3 class="card-owner">@${resource.owner_name}</h3>
  <p>${timeago.format(resource.date_added)}</p>
  </div>
  </header>
    <p class="card-text">${resource.description}</p>
    <footer>
    <p class="resource-category">#${resource.category_name}</p>

    <div class="likes-ratings">
    <p>${resource.count_likes}<i id="like-button" class="fa-solid fa-heart"></i></p>
    <p>${resource_ratings}<i class="fa-solid fa-star"></i></p>
    </div>
    </footer>
    </div>
  </section>
</article>
  `);
  return $resource;
};

//Renders form for new resources
const newResourceFormMarkup = () => {
  const $resourceForm = $(`
  <form>
  <h2>Create New Resource</h2>
  <article class="mb-3">
    <label for="url-field" class="form-label" style="display: none">Resource URL</label>
    <input type="url" class="form-control" id="url-field" placeholder="URL">
  </article>
  <article class="mb-3">
    <label for="name-field" class="form-label" style="display: none">Resource Title</label>
    <input type="text" class="form-control" id="name-field" placeholder="Title">
  </article>
  <article class="mb-3">
    <label for="description-field" class="form-label" style="display: none">Resource Description</label>
    <input type="text" class="form-control" id="description-field" placeholder="Description">
  </article>
  <select class="form-select" id="category-dropdown">
    <option selected>Category</option>
  </select>
  <select class="form-select" id="resource_type-dropdown">
    <option selected>Resource Type</option>
  </select>
  <button type="submit" class="btn btn-success" id="submit-new-resource">Submit</button>
  <button type="button" class="btn btn-danger" id="cancel-new-resource" >Cancel</button>
</form>
  `);
  return $resourceForm;
};

//Creates markup for categories to be shown in the dropdown
const categoryMarkup = (category) => {
  const $category = $(`
  <option>${category.name}</option>
  `);
  return $category;
};

//Creates markup for resource_types to be shown in the dropdown
const resourceTypeMarkup = (resource_type) => {
  const $resource_type = $(`
  <option>${resource_type.name}</option>
  `);
  return $resource_type;
};

//creates markup for a single resource, called by submitting new resource, editting a resource, or clicking a resource
const singleResourceAppendixMarkup = () => {
  const $singleResource = $(`
    <div id="modify-resource-buttons">
    <button type="button" id="edit-resource-button" class="btn btn-success btn-sm">Edit Resource</button>
    <button type="button" id="delete-resource-button" class="btn btn-danger btn-sm">Delete Resource</button>
    </div>
    <section id="rating-stars">
    <h3>Rate this resource!</h3>
    <ol>
    <li><i id="1-star" class="fa-solid fa-star"></i></li>
    <li><i id="2-star" class="fa-solid fa-star"></i></li>
    <li><i id="3-star" class="fa-solid fa-star"></i></li>
    <li><i id="4-star" class="fa-solid fa-star"></i></li>
    <li><i id="5-star" class="fa-solid fa-star"></i></li>
    </ol>
    </section>
  `);
  return $singleResource;
};

// Creates markup for each comment under a single resource
const commentMarkup = (comment) => {
  const $comment = $(`
  <section class="comment">
  <p class="comment-message">${comment.message}</p>
  <footer>Posted By: ${comment.commenter_name} Date Posted: ${timeago.format(comment.post_date)}</footer>
  </section>
  `);
  return $comment;
};

// HTML to render the form for a new comment submission
const $commentForm = $(`
  <form id="new-comment-form" method="POST">
    <h2>Write A New Comment</h2>
    <label for="new-comment-message" class="form-label"></label>
    <textarea name="text" class="new-comment" id="new-comment-message" placeholder="New Comment"></textarea>
    <button type="submit" class="btn btn-success btn-sm">Post Comment</button>
  </form>
`);

// Creates markup to render edit resource page when called from single resource page
const editResourceFormMarkup = (resource) => {
  const $editResourceForm = $(`
  <form>
  <h2>Update Your Resource</h2>
  <article class="mb-3">
    <label for="name-field" class="form-label" style="display: none"></label>
    <input type="text" class="form-control" id="name-field" value="${resource.name}">
  </article>
  <article class="mb-3">
    <label for="description-field" class="form-label" style="display: none"></label>
    <input type="text" class="form-control" id="description-field" value="${resource.description}">
  </article>
  <select class="form-select" id="category-dropdown">
    <option selected>${resource.category_name}</option>
  </select>
  <select class="form-select" id="resource_type-dropdown">
    <option selected>${resource.resource_type_name}</option>
  </select>
  <span id="${resource.id}" style="display: none;"></span>
  <button type="submit" class="btn btn-success" id="edit-resource">Submit</button>
  <button type="button" class="btn btn-danger" id="back-to-resource">Cancel</button>
</form>
  `);
  return $editResourceForm;
};

// Creates markup to render edit resource page when called from single resource page
const deleteResourceFormMarkup = (resource) => {
  const $deleteResourceForm = $(`
  <form id="delete-${resource.id}">
  <h2>Are You Sure?</h2>
  <p>Deleting <span class="resource name">${resource.name}</span> will permanently remove it from Your Resources<p>
    <button type="submit" class="btn btn-danger" id="confirm-delete-resource">Delete</button>
    <button type="button" class="btn btn-success" id="cancel-delete-resource">Cancel</button>
</form>
  `);
  return $deleteResourceForm;
};

/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Listeners
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load 'Homepage' on navbar logo click
$(() => {
  $('.navbar-brand').on('click', function() {
    $.ajax({
      method: 'GET',
      url: 'api/resources/recent',
    })
      .done((response) => {
        loadHomepage(response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

// 'Homepage' -- Load 10 most recent resources on first page load and full reload
$(() => {
  $(document).ready(function() {
    $.ajax({
      method: 'GET',
      url: 'api/resources/recent',
    })
      .done((response) => {
        loadHomepage(response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

// listener for "View all resources" when clicked from the nav bar
$(() => {
  $('#get-all-resources').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/resources'
    })
      .done((response) => {
        loadAllResources(response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

//Listener for "Add Resource" that displays creation form when clicked from the nav bar
$(() => {
  $('#show-new-resource-form').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/resources/new'
    })
      .done((response) => {
        loadForm('#section-add-new-resource', newResourceFormMarkup, response)
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

// Listener for new resource form submission
$(() => {
  $('#section-add-new-resource').submit(function(event) {
    event.preventDefault();
    const resource = {
      url: $('#url-field').val(),
      name: $('#name-field').val(),
      description: $('#description-field').val(),
      category_id: $('#category-dropdown').val(),
      resource_type_id: $('#resource_type-dropdown').val()
    };
    $.ajax({
      method: 'POST',
      url: 'api/resources/',
      data: resource
    })
      .done((data) => {
        $.ajax({
          method: 'GET',
          url: `api/resources/${data.id}`,
        })
          .done((response) => {
            loadSingleResource(response);
          });
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

//Listener for cancelling new resource submission
$(() => {
  $(document).on('click', '#cancel-new-resource', function() {
    $.ajax({
      method: 'GET',
      url: `api/resources/recent`
    })
      .done((response) => {
        loadAllResources(response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

// Listener for displaying a single resource when selected from all resources
$(() => {
  $('#all-resources').on('click', '#resource-link', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}`,
    })
      .done((response) => {
        loadSingleResource(response);
      });
  });
});

// Listener for displaying a single resource when selected from My Resources or Liked Resources
$(() => {
  $('#section-user-resources').on('click', '#resource-link', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}`,
    })
      .done((response) => {
        loadSingleResource(response);
      });
  });
});

// On single resource page - on click of heart icon, save like and update page

$(() => {
  $('#section-single-resource').on('click', '#like-button', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    const likeData = { resourceId: resourceId };
    $.ajax({
      method: 'POST',
      url: 'api/interacts/like',
      data: likeData
    })
      .done((response) => {
        if (response.status === 401) {
        } else {
          $.ajax({
            method: 'GET',
            url: `api/resources/${resourceId}`,
          })
            .done((response) => {
              loadSingleResource(response);
            });
        }
      });
  });
});

// On single resource page - on submission of comment form, save comment and update page
$(() => {
  $('#section-single-resource').on('submit', '#new-comment-form', function(event) {
    const resourceId = $(this).closest('section').find('article').attr('id').split('-')[1];
    const newComment = $(this).serializeArray();
    const commentLength = $(this)[0][0].value.trim().length;
    const commentData = { resourceId, newComment };

    if (commentLength === 0) {
      //add logic for error message to user
    } else {
      $.ajax({
        method: 'POST',
        url: 'api/interacts/comment',
        data: commentData
      })
        .done((response) => {
          if (response.status === 401) {
          } else {
            $.ajax({
              method: 'GET',
              url: `api/resources/${resourceId}`,
            })
              .done((response) => {
                $(this).trigger('reset');
                loadSingleResource(response);
              });
          }
        });
    }
    event.preventDefault();
  });
});


// On single resource page - on click on star to save rating and update page

$(() => {
  $('#section-single-resource').on('click', '#1-star', function() {
    const rating = 1;
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    const ratingData = { rating, resourceId };
    $.ajax({
      method: 'POST',
      url: 'api/interacts/rate',
      data: ratingData
    })
      .done((response) => {
        if (response.status === 401) {
        } else {
          $.ajax({
            method: 'GET',
            url: `api/resources/${resourceId}`,
          })
            .done((response) => {
              loadSingleResource(response);
            });
        }
      });
  });
});

$(() => {
  $('#section-single-resource').on('click', '#2-star', function() {
    const rating = 2;
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    const ratingData = { rating, resourceId };
    $.ajax({
      method: 'POST',
      url: 'api/interacts/rate',
      data: ratingData
    })
      .done((response) => {
        if (response.status === 401) {
        } else {
          $.ajax({
            method: 'GET',
            url: `api/resources/${resourceId}`,
          })
            .done((response) => {
              loadSingleResource(response);
            });
        }
      });
  });
});
$(() => {
  $('#section-single-resource').on('click', '#3-star', function() {
    const rating = 3;
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    const ratingData = { rating, resourceId };
    $.ajax({
      method: 'POST',
      url: 'api/interacts/rate',
      data: ratingData
    })
      .done((response) => {
        if (response.status === 401) {
        } else {
          $.ajax({
            method: 'GET',
            url: `api/resources/${resourceId}`,
          })
            .done((response) => {
              loadSingleResource(response);
            });
        }
      });
  });
});
$(() => {
  $('#section-single-resource').on('click', '#4-star', function() {
    const rating = 4;
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    const ratingData = { rating, resourceId };
    $.ajax({
      method: 'POST',
      url: 'api/interacts/rate',
      data: ratingData
    })
      .done((response) => {
        if (response.status === 401) {
        } else {
          $.ajax({
            method: 'GET',
            url: `api/resources/${resourceId}`,
          })
            .done((response) => {
              loadSingleResource(response);
            });
        }
      });
  });
});
$(() => {
  $('#section-single-resource').on('click', '#5-star', function() {
    const rating = 5;
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    const ratingData = { rating, resourceId };
    $.ajax({
      method: 'POST',
      url: 'api/interacts/rate',
      data: ratingData
    })
      .done((response) => {
        if (response.status === 401) {
        } else {
          $.ajax({
            method: 'GET',
            url: `api/resources/${resourceId}`,
          })
            .done((response) => {
              loadSingleResource(response);
            });
        }
      });
  });
});

// listener for displaying form to edit resource when selected from single resource page
$(() => {
  $(document).on('click', '#edit-resource-button', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}/edit`,
    })
      .done((response) => {
        loadForm('#section-edit-resource', editResourceFormMarkup, response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

//Listener for subitting resource edits from edit resource page
$(() => {
  $(document).on('click', '#edit-resource', function(event) {
    event.preventDefault();
    const resourceId = $(this).siblings('span').attr('id');
    const resource = {
      name: $('#name-field').val(),
      description: $('#description-field').val(),
      category_id: $('#category-dropdown').val(),
      resource_type_id: $('#resource_type-dropdown').val(),
      id: resourceId
    };
    $.ajax({
      method: 'POST',
      url: 'api/resources/:id',
      data: resource
    })
      .done((data) => {
        $.ajax({
          method: 'GET',
          url: `api/resources/${data.id}`,
        })
          .done((response) => {
            loadSingleResource(response);
          });
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

//Listener for cancelling resource edits from edit resource page
$(() => {
  $(document).on('click', '#back-to-resource', function() {
    const resourceId = $(this).siblings('span').attr('id');
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}`,
    })
      .done((response) => {
        loadSingleResource(response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

// Listener for displaying delete/archive resource confirmation page
$(() => {
  $(document).on('click', '#delete-resource-button', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}/delete`,
    })
      .done((resource) => {
        pageCleanup();
        $('#section-delete-resource').append(deleteResourceFormMarkup(resource));
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

// Listener for deleting a resource once confirmed
$(() => {
  $(document).on('click', '#confirm-delete-resource', function() {
    const resourceId = $(this).siblings('span').attr('id');
    $.ajax({
      method: 'POST',
      url: `api/resources/${resourceId}/delete`
    })
      .done((resource) => {
        $.ajax({
          method: 'GET',
          url: 'api/users/resources'
        })
          .done((response) => {
            pageCleanup();
            $('#section-user-resources').append(myResourcesShellMarkup());
            renderResources("#owned-resources-tab-pane", response.ownedResources);
            renderResources("#liked-resources-tab-pane", response.likedResources);
          })
          .catch((err) => {
            console.log('err:', err);
          });
      });
  });
});

//Listener for canceling delete resource
$(() => {
  $(document).on('click', '#cancel-delete-resource', function() {
    const resourceId = $(this).closest('form').attr('id').split('-')[1];
    console.log(resourceId);
    pageCleanup();
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}`,
    })
      .done((response) => {
        loadSingleResource(response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});
