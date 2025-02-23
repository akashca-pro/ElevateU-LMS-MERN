const NotFound = () => {
    const styles = {
      container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f0f0",
        color: "#1A064F",
      },
      header: {
        fontSize: "8rem",
        fontWeight: "bold",
        color: "#7454FD",
        margin: "0",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
      },
      message: {
        fontSize: "1.5rem",
        marginTop: "1rem",
        marginBottom: "2rem",
      },
      button: {
        padding: "10px 20px",
        fontSize: "1rem",
        backgroundColor: "#7454FD",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s",
      },
      decorativeCircle: {
        position: "absolute",
        borderRadius: "50%",
        opacity: "0.1",
      },
    }
  
    const handleGoHome = () => {
      // In a real application, you would use your routing library here
      // For example, with react-router: history.push('/')
      window.location.href = "/"
    }
  
    return (
      <div style={styles.container}>
        <div
          style={{
            ...styles.decorativeCircle,
            top: "10%",
            left: "10%",
            width: "200px",
            height: "200px",
            backgroundColor: "#7454FD",
          }}
        />
        <div
          style={{
            ...styles.decorativeCircle,
            bottom: "10%",
            right: "10%",
            width: "150px",
            height: "150px",
            backgroundColor: "#1A064F",
          }}
        />
        <h1 style={styles.header}>404</h1>
        <p style={styles.message}>Oops! The page you're looking for doesn't exist.</p>
        <button
          style={styles.button}
          onClick={handleGoHome}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#5c43cc")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#7454FD")}
        >
          Go Back to Home
        </button>
      </div>
    )
  }
  
  export default NotFound
  
  