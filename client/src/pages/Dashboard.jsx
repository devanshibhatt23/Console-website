import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, profile, loading } = useAuth();

  if (loading) return <h2>Loading...</h2>;

  return (
    <>
      <h1>Dashboard</h1>

      <h2>{user?.email}</h2>

      <h2>{profile?.role}</h2>
    </>
  );
}