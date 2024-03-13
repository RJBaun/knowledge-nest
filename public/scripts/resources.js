// Created by Rylan Baun
// Created March 11, 2024
// Purpose: Render all resource related pages


/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Helper Functions
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// renders all resources on the webpage
const renderResources = (response) => {
  response.resources.forEach(resource => {
    $("#all-resources").prepend(createResourceMarkup(resource));
  });
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

// Renders comments for a single resource
const renderComments = (comments) => {
  comments.forEach((comment) => {
    $('#section-single-resource').append(commentMarkup(comment));
  });
};

const renderResourcePage = (response) => {
  pageCleanup();
  $('#section-single-resource').append(singleResourceMarkup(response.resource));
  $('#section-single-resource').append($commentForm);
  renderComments(response.comments);
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Markups
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// generates resource card and returns it to be rendered, given a resource object input
const createResourceMarkup = (resource) => {
  if (!resource.avg_rating) {
    resource_ratings = "No Ratings Yet";
  } else {
    resource_ratings = `${resource.avg_rating}`;
  }
  const $resource = $(`
  <article id="resource-${resource.id}" class="card" style="width: 90vw;">
  <i class=${resource.icon_link}></i>
  <section id="resource-link" class="card-body">
    <h5 class="card-title">${resource.name}</h5>
    <p class="card-text">${resource.description}</p>
    <a href="${resource.url}" class="btn btn-primary">Visit Resource</a>
    <footer class="resource-footer">
    <div class="resource-category">#${resource.category_name}</div>
    <div class="likes">
      <p>${resource.count_likes}</p>
      <i class="fa-solid fa-heart"></i>
    </div>
    <div class="ratings">
      <p>${resource_ratings}</p>
      <i class="fa-solid fa-star"></i>
    </div>

    </footer>
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
  <button type="submit" class="btn btn-primary" id="submit-new-resource">Submit</button>
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
const singleResourceMarkup = (resource) => {
  let resource_ratings;
  if (!resource.avg_rating) {
    resource_ratings = "No Ratings Yet";
  } else {
    resource_ratings = `${resource.avg_rating}`;
  }
  const $singleResource = $(`
  <article id="resource-${resource.id}" class="card" style="width: 90vw;">
  <i class=${resource.icon_link}></i>
  <section id="single-resource" class="card-body">
    <h5 class="card-title">${resource.name}</h5>
    <p class="card-text">${resource.description}</p>
    <a href="${resource.url}" class="btn btn-primary">Visit Resource</a>
    <span>
    <button type="button" id="edit-resource-button" class="btn btn-primary btn-sm">Edit Resource</button>
    <button type="button" id="delete-resource-button" class="btn btn-primary btn-sm">Delete Resource</button>
      <div class="likes">
      <p>${resource.count_likes}
      <i id="like-button" class="fa-solid fa-heart"></i></p>
    </div>
    <div class="ratings">
      <p>${resource_ratings}
      <i id="rate-button" class="fa-solid fa-star"></i></p>
    </div>
    </footer>
  </section>
  </article>
  `);
  return $singleResource;
};

// Creates markup for each comment under a single resource
const commentMarkup = (comment) => {
  const $comment = $(`
  <section class="comment">
  <p class="comment-message">${comment.message}</p>
  <footer>Posted By: ${comment.commenter_name} Date Posted: ${comment.post_date}</footer>
  </section>
  `);
  return $comment;
};

// HTML to render the form for a new comment submission
const $commentForm = $(`
  <form id="new-comment-form">
    <h5>Write A New Comment</h5>
    <section>
      <input type="text" class="new-comment" id="new-comment-message" placeholder="New Comment"></input>
      <button type="button" class="btn btn-primary btn-sm">Post Comment</button>
    </section>
`);

// Creates markup to render edit resource page when called from single resource page
const editResourceFormMarkup = (resourceId) => {
  const $editResourceForm = $(`
  <form>
  <h2>Update Your Resource</h2>
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
  <span id="${resourceId}" style="display: none;"></span>
  <button type="submit" class="btn btn-primary" id="submit-new-resource">Submit</button>
</form>
  `);
  return $editResourceForm;
};


// Creates markup to render edit resource page when called from single resource page
const deleteResourceFormMarkup = (resource) => {
  const $deleteResourceForm = $(`
  <form>
  <h2>Are You Sure?</h2>
  <p>Deleting <span class="resource name">${resource.name}</span> will permanently remove it from Your Resources<p>
  <span id="${resource.id}" style="display: none;"></span>
    <button type="submit" class="btn btn-danger" id="confirm-delete-resource">Delete</button>
    <button type="submit" class="btn btn-primary" id="cancel-delete-resource">Cancel</button>
</form>
  `);
  return $deleteResourceForm;
};


/////////////////////////////////////////////////////////////////////////////////////////////////////////
///// Listeners
/////////////////////////////////////////////////////////////////////////////////////////////////////////

// listener for "View all resources" when clicked from the nav bar
$(() => {
  $('#get-all-resources').on('click', () => {
    $.ajax({
      method: 'GET',
      url: '/api/resources'
    })
      .done((response) => {
        pageCleanup();
        renderResources(response);
        $('.resource-link').on('click', function() {
        });
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

//Listener for "Add Resource" that displays creation form when clicked from the nav bar
$(() => {
  $('#show-new-resource-form').on('click', () => {
    pageCleanup();
    $('#section-add-new-resource').append(newResourceFormMarkup());
    $.ajax({
      method: 'GET',
      url: '/api/resources/new'
    })
      .done((response) => {
        showCategoryOptions(response);
        showResourceTypeOptions(response);
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
      resource_type_id: $('#resource_type-dropdown').val(),
      owner_id: 1
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
            pageCleanup();
            $('#section-single-resource').append(singleResourceMarkup(response.resource));
            $('#section-single-resource').append($commentForm);
            renderComments(response.comments);
          });
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

// Listener for displaying a single resource when selected from all resources
$(() => {
  $(document).on('click', '#resource-link', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}`,
    })
      .done((response) => {
        renderResourcePage(response);
      });
  });
});

// On single resource page - on click of heart icon, save like and update page

$(() => {
  $('#section-single-resource').on('click', '#like-button', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    const likeData = { resourceId: resourceId }
    console.log('resource liked. Id is', resourceId);
    $.ajax({
      method: 'POST',
      url: 'api/interacts/like',
      data: likeData
    })
      .done((response) => {
        console.log('responded', response);
        $.ajax({
          method: 'GET',
          url: `api/resources/${resourceId}`,
        })
          .done((response) => {
            renderResourcePage(response);
          });
      });
  });
});




// listener for displaying form to edit resource when selected from single resource page
$(() => {
  $(document).on('click', '#edit-resource-button', function() {
    const resourceId = $(this).closest('article').attr('id').split('-')[1];
    pageCleanup();
    $('#section-edit-resource').append(editResourceFormMarkup(resourceId));
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}/edit`,
    })
      .done((response) => {
        showCategoryOptions(response);
        showResourceTypeOptions(response);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

//Listener fo subitting resource edits from edit resource page
$(() => {
  $(document).on('submit', '#section-edit-resource', function(event) {
    event.preventDefault();
    const resourceId = $(this).find('span').attr('id');
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
            pageCleanup();
            $('#section-single-resource').append(singleResourceMarkup(response.resource));
            $('#section-single-resource').append($commentForm);
            renderComments(response.comments);
          });
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
    pageCleanup();
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}/delete`,
    })
      .done((resource) => {
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
    console.log(resourceId);
    pageCleanup();
    $.ajax({
      method: 'POST',
      url: `api/resources/${resourceId}/delete`
    })
      .done((resource) => {

        //Redirect to users resources
        console.log(resource);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});

//Listener for canceling delete resource
$(() => {
  $(document).on('click', '#cancel-delete-resource', function() {
    const resourceId = $(this).siblings('span').attr('id');
    console.log(resourceId);
    pageCleanup();
    $.ajax({
      method: 'GET',
      url: `api/resources/${resourceId}`,
    })
      .done((response) => {
        pageCleanup();
        $('#section-single-resource').append(singleResourceMarkup(response.resource));
        $('#section-single-resource').append($commentForm);
        renderComments(response.comments);
      })
      .catch((err) => {
        console.log('err:', err);
      });
  });
});
