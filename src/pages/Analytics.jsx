import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import "./Analytics.css";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
const Analytics = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPage = 5;

  useEffect(() => {
    fetch("/db.json")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const authorStats = posts.reduce((acc, post)=>{
    const author = post.author || 'Unknown';
    acc[author]=(acc[author] || 0)+1;
    return acc;
  },{});

  const ChartData =Object.keys(authorStats).map(author=>({
    name: author,
    posts: authorStats[author]
  }));


  const indexofLastPost = currentPage * postsPage;
  const indexofFirstPost = indexofLastPost - postsPage;
  const currentPosts = posts.slice(indexofFirstPost, indexofLastPost);
  const totalPage = Math.ceil(posts.length / postsPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  //example and diff.of ceil

 

  const headers = [
    { label: "ID", key: "id" },
    { label: "Author", key: "author" },
    { label: "Title", key: "title" },
    { label: "Date", key: "createdAt" },
    { label: "Action", key: "" },
  ];

  const COLORS = ["#0088fe", "#00d49f", "#ffbb28", "#ff8042"];

  return (
    <div className="analytics-page">
      <Navbar />
      <main className="analytics-main">
        <header className="analytics-header">
          <h1>Blog Analytics</h1>
          <p>Insights into your blog performance and activities</p>
        </header>

        <div className="charts-container">
          {/* Bar Chart */}
          <div className="chart-card">
            <h3>Posts per Author</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ChartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="posts" fill="#8884d8" name="Number of Posts" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="chart-card">
            <h3>Distribution</h3>
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={ChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="posts"
                  >
                    {ChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="posts-table-section">
          <h3>All Posts</h3>
          <div className="table-wrapper">
            <table className="analytics-table">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th key={index}>{header.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((post) => (
                  <tr key={post.id}>
                    <td>{post.id}</td>
                    <td>{post.author}</td>
                    <td>{post.title}</td>
                    <td>
                      {post.createdAt
                        ? new Date(post.createdAt).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="action-btn">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(post.id)}
                        title="Edit"
                      >
                        🖌️
                      </button>
                      <button
                        className="edit-btn"
                        onClick={() => handleDelete(post.id)}
                        title="Detele"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>
            {[...Array(totalPage).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`page-btn ${currentPage === number + 1 ? "active" : ""}`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPage}
              className="page-btn"
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
