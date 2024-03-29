import { isRouteErrorResponse, useRouteError } from "react-router-dom";


export function ErrorPage(): JSX.Element {
  const error = useRouteError();
  let errorMessage = '';

  if (typeof error === 'object' && error !== null) {
    if (isRouteErrorResponse(error)) {
      errorMessage = error.statusText || "Route error occurred";
      if (error.data) {
        console.error(error.data)
      }
    } 
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      errorMessage = "An unknown error occurred";
    }
  } 
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else {
    errorMessage = "An unexpected error occurred";
  }

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{errorMessage}</i>
      </p>
    </div>
  );
}
