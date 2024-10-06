let routes = []
function setRoutes(routeObj){
    routes=[...routeObj]
}


export function renderContent() {
  // Clearing previous content from root
  document.getElementById("root").innerHTML = "";

  // Adding event listeners for initial content
  addListeners(document, "/");

  // spliting current url into path segments
  const pathArray = window.location.pathname.split("/").filter(Boolean);

  let availableRoutes = routes; // starting with top level routes

  if (pathArray.length === 0) {
    return;
  }

  pathArray.forEach((path, index) => {
    let view = findRouteBasedOnPath(availableRoutes, path);

    const allOutletDivs = Array.from(document.getElementsByClassName("outlet"));

    // Select the last outlet div or the root element, if not found
    let outletDivToRender =
      allOutletDivs.length > 0
        ? allOutletDivs[allOutletDivs.length - 1]
        : document.getElementById("root");

    if (!view) {
      outletDivToRender.innerHTML = "Page Not Found";

      return;
    } else {
      outletDivToRender.innerHTML = view.content;
    }

    // Add event listeners for the newly rendered content
    addListeners(
      outletDivToRender,
      [...pathArray].splice(0, index + 1).join("/")
    );

    // Updating availableRoutes to children if available for next path
    availableRoutes = view.children ? view.children : [];
  });
}

function addListeners(parentElement, parentRoute = "/") {
  // Add listeners to all "my-link" elements
  Array.from(parentElement.getElementsByTagName("my-link")).forEach((link) => {
    let linkRoute = link.getAttribute("data-route");

    // Construct the full route path for the link
    let updatedRoutePath = linkRoute.startsWith("/")
      ? linkRoute
      : parentRoute.startsWith("/")
      ? `${parentRoute}/${linkRoute}`
      : `/${parentRoute}/${linkRoute}`;

    link.setAttribute("data-route", updatedRoutePath);

    link.addEventListener("click", (e) => {
      const loginState = checkLoginState()
      console.log({loginState},loginState === true)
      e.preventDefault();
      const routeType = link.getAttribute('data-route-type')
      console.log({routeType})
      if(routeType && routeType.toLowerCase()==='private' && !loginState){
        document.getElementById('root').innerHTML = '<h3>Unauthorized !! Login to access this route </h3>'
        return;
      }
      const routePath = link.getAttribute("data-route");

      if (window.location.pathname === routePath) {
        return;
      }

      history.pushState(null, null, routePath);
      renderContent();
    });
  });

  // Add listeners to all buttons with data-type="navigate"
  parentElement
    .querySelectorAll('button[data-btn-type="navigate"]')
    .forEach((link) => {
      let linkRoute = link.getAttribute("data-route");

      let updatedRoutePath = linkRoute.startsWith("/")
        ? linkRoute
        : parentRoute.startsWith("/")
        ? `${parentRoute}/${linkRoute}`
        : `/${parentRoute}/${linkRoute}`;

      link.setAttribute("data-route", updatedRoutePath);

      link.addEventListener("click", (e) => {
        e.preventDefault();
        const routePath = link.getAttribute("data-route");

        if (window.location.pathname === routePath) {
          return;
        }

        history.pushState(null, null, routePath);
        renderContent();
      });
    });
}

function checkLoginState(){
  return localStorage.getItem('login') ? true : false
}

function findRouteBasedOnPath(availableRoutes, path) {
  return availableRoutes.find(
    (route) => route.path === path || route.path === `/${path}`
  );
}

export function createRouter(routes) {
    setRoutes(routes)

  // Initialize listeners and render the initial content
  renderContent();

  // Handle back/forward navigation
  window.addEventListener("popstate", () => {
    renderContent();
  });
}


// listening for login/logout btn if available
const authBtn = document.querySelector('button[data-btn-type="auth"]')

authBtn?.addEventListener('click',()=>{

  const loginState = localStorage.getItem('login')
  if(loginState){
    localStorage.removeItem('login')
    authBtn.innerText = "Login"
  }else{
    localStorage.setItem('login','true')
    authBtn.innerText = "Logout"
  }
  // renderContent()
})


export function navigate(route){
  history.pushState(null,null,route)
  renderContent()
}

function resetLoginState(){
  localStorage.removeItem('login')
}

resetLoginState()




// exposing functions
window.MyRouter = {
    renderContent,
    addListeners,
    findRouteBasedOnPath,
    createRouter,
    navigate,
    checkLoginState 
};