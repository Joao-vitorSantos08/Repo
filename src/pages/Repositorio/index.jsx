import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { Container, Owner, Loading, BackButton, IssuesList, PageActions, FilterList } from "./style"
import api from "../../service/api"

const Repositorio = () => {

    const { repositorio } = useParams();

    const [repos, setRepositorio] = useState({});
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pages, setPages] = useState(1)
    const [filters, setFilters] = useState([
        { state: "all", label: "Todas", active: true },
        { state: "open", label: "Abertas", active: false },
        { state: "closed", label: "Fechadas", active: false }
    ]);
    const [filterIndex, setFilterIndex] = useState(0)

    useEffect(() => {
        const load = async () => {
            const nomeRepo = decodeURIComponent(repositorio)

            const [repositorioData, issuesData] = await Promise.all([
                api.get(`/repos/${nomeRepo}`),
                api.get(`/repos/${nomeRepo}/issues`, {
                    params: {
                        state: filters.find(f => f.active).state,
                        per_page: 5
                    }
                })
            ]);

            setRepositorio(repositorioData.data)
            setIssues(issuesData.data)
            setLoading(false)
        };

        load()
    }, [repositorio])


    useEffect(() => {
        const loadIssue = async () => {
            const nomeRepo = decodeURIComponent(repositorio)

            const response = await api.get(`/repos/${nomeRepo}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page: pages,
                    per_page: 5,
                }
            })

            setIssues(response.data)

        }
        loadIssue()
    }, [pages, repositorio, filterIndex, filters])

    if (loading) {
        return (
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )

    }

    const handlePage = (action) => {
        setPages(action === "back" ? pages - 1 : pages + 1)
    }

    const handleFilter = (index) => {
        setFilterIndex(index);
    }

    return (
        <Container>
            <BackButton to="/">
                <FaArrowLeft color="#000" size={30} />
            </BackButton>
            <Owner>
                <img src={repos.owner.avatar_url}
                    alt={repos.owner.login}
                />
                <h1>{repos.name}</h1>
                <p>{repos.description}</p>
            </Owner>

            <FilterList active={filterIndex}>
                {filters.map((filter, index) => (
                    <button type="button"
                        key={filter.label}
                        onClick={() => handleFilter(index)}
                    >
                        {filter.label}
                    </button>
                ))}
            </FilterList>

            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url}
                            alt={issue.user.login}
                        />
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>

            <PageActions>

                <button
                    type="button"
                    onClick={() => handlePage(`back`)}
                    disabled={pages < 2}
                >
                    Voltar
                </button>
                <button type="button" onClick={() => handlePage(`next`)}>
                    Proxíma
                </button>
            </PageActions>

        </Container>
    );
};

export default Repositorio;
