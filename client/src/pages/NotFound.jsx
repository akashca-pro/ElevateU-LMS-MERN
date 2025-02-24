import Footer from "@/components/Footer"

const NotFound = () => {
    const styles = {
      container: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "66vh", // Reduced height so footer fits
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f0f0f0",
        color: "#1A064F",
        padding: "20px",
      },
      content: {
        textAlign: "center",
        padding: "40px",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        maxWidth: "500px",
      },
      header: {
        fontSize: "6rem", // Decreased size
        fontWeight: "bold",
        color: "#7454FD",
        margin: "0",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
      },
      message: {
        fontSize: "1.2rem", // Slightly reduced
        marginTop: "1rem",
        marginBottom: "1.5rem",
      },
      button: {
        padding: "8px 16px",
        fontSize: "1rem",
        backgroundColor: "#7454FD",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "background-color 0.3s",
      },
    }
  
    const handleGoHome = () => {
      window.location.href = "/"
    }
  
    return (
      <>
        <div style={styles.container}>
          <div style={styles.content}>
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
        </div>
        <Footer />
      </>
    )
}

export default NotFound