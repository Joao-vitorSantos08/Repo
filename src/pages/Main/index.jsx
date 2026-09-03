import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Form, SubmitButton, List, DeleteButton } from "./style";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import api from "../../service/api";

const Main = () => {
    const [newRepo, setNewRepo] = useState("");
    const [loading, setLoading] = useState(false);
    const [alerta, setAlerta] = useState(null);
    const [repos, setRepos] = useState(() => {
        const reposStorage = localStorage.getItem("repos");
        return reposStorage ? JSON.parse(reposStorage) : [];
    });


    useEffect(() => {
        localStorage.setItem("repos", JSON.stringify(repos))
    }, [repos])

    const handleInput = (e) => {
        setNewRepo(e.target.value);
        setAlerta(null)
    };

    const handleSubmit = useCallback((e) => {
        e.preventDefault();

        const submit = async () => {
            setLoading(true);
            setAlerta(null);

            try {
                if (newRepo.trim() === "") {
                    throw new Error("Você precisa indicar um repositório!");
                }

                const hasRepo = repos.find(
                    repo => repo.name.toLowerCase() === newRepo.toLowerCase().trim()
                );

                if (hasRepo) {
                    throw new Error("Repositório duplicado");
                }

                const response = await api.get(`repos/${newRepo}`);

                const data = {
                    name: response.data.full_name,
                };

                setRepos([...repos, data]);
                setNewRepo("");
            } catch (error) {
                setAlerta(true);
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        submit();
    }, [newRepo, repos]);

    const handleDelete = useCallback((repo) => {
        const find = repos.filter(r => r.name !== repo);
        setRepos(find);
    }, [repos]);

    return (
        <Container>
            <h1>
                <FaGithub size={24} />
                Meus Repositórios
            </h1>

            <Form onSubmit={handleSubmit} $error={alerta}>
                <input
                    type="text"
                    placeholder="Adicionar Repositórios"
                    value={newRepo}
                    onChange={handleInput}
                />

                <SubmitButton loading={loading ? 1 : 0}>
                    {loading ? (
                        <FaSpinner color="#FFF" size={14} />
                    ) : (
                        <FaPlus color="#FFF" size={14} />
                    )}
                </SubmitButton>
            </Form>

            <List>
                {repos.map(repo => (
                    <li key={repo.name}>
                        <span>{repo.name}</span>
                        <DeleteButton onClick={() => handleDelete(repo.name)}>
                            <FaTrash size={14} />
                        </DeleteButton>
                        <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                            <FaBars size={20} />
                        </Link>
                    </li>
                ))}
            </List>
        </Container>
    );
};

export default Main;
