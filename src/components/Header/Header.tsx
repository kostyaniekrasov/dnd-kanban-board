import { useIssuesStore } from '@/store/useIssuesStore';
import React, { useState } from 'react';
import { Button, Fade, Form } from 'react-bootstrap';

const Header = () => {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState<boolean | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const { loadIssues, repoData } = useIssuesStore();

  const GITHUB_REPO_REGEX = /^https:\/\/github\.com\/([\w-]+)\/([\w-]+)$/;

  const handleEnterUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.currentTarget.value;
    const match = GITHUB_REPO_REGEX.exec(newUrl.trim());

    setFormSubmitted(false);
    setUrl(newUrl);
    setIsValidUrl(match !== null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    const match = GITHUB_REPO_REGEX.exec(url.trim());

    e.preventDefault();

    setFormSubmitted(true);

    if (!isValidUrl || !match) {
      return;
    }

    const owner = match[1];
    const repo = match[2];

    await loadIssues(owner, repo);
  };

  return (
    <header>
      <Form
        noValidate
        onSubmit={handleSubmit}
        className="d-flex gap-3 pt-4"
        style={{
          height: 97,
        }}
      >
        <Form.Group controlId="validation" className="flex-grow-1">
          <Form.Control
            data-cy="input-url"
            size="lg"
            type="text"
            placeholder="Enter repo URL"
            value={url}
            onChange={handleEnterUrl}
            isInvalid={
              (isValidUrl === false && formSubmitted) ||
              (!url.trim().length && formSubmitted)
            }
            required
          />
          <Fade in={!isValidUrl && formSubmitted} appear>
            <Form.Control.Feedback
              data-cy="invalid-url-text"
              type="invalid"
              className="d-block"
            >
              Please enter a valid repository URL (e.g.
              https://github.com/facebook/react)
            </Form.Control.Feedback>
          </Fade>
        </Form.Group>

        <div>
          <Button
            data-cy="submit-button"
            variant="secondary"
            size="lg"
            type="submit"
          >
            Load issues
          </Button>
        </div>
      </Form>

      {repoData && (
        <Fade in={!!repoData.owner.length}>
          <div
            data-cy="repo-links"
            className="d-flex gap-2 text-white align-items-center mb-4"
          >
            <a
              href={`https://github.com/${repoData.owner}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-white fs-5 p-0 link-primary"
            >
              {`${repoData.owner}`}
            </a>
            <span>/</span>
            <a
              href={`https://github.com/${repoData.owner}/${repoData.repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-white fs-5 p-0 fw-bold link-primary"
            >
              {repoData.repo}
            </a>
          </div>
        </Fade>
      )}
    </header>
  );
};

export default Header;
