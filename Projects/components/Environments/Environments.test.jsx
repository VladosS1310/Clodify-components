import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import Environments from './Environments';
import renderWithData from '../../../../../test-utils';
import { checkApiUrl } from '../../../../../utils/helpers';
import { createMemoryHistory } from 'history';

const handlers = [
  rest.get(`${checkApiUrl()}/api/projects/1/env`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: 1,
            project: {
              project_id: 1,
              project_name: 'Magento 2 Enterprise Edition',
            },
            branch: 'master',
            access_roles: 'ADMIN',
            last_updated: '2020-10-06 16:13:58',
          },
          {
            id: 2,
            project: {
              project_id: 1,
              project_name: 'React',
            },
            branch: 'staging',
            access_roles: 'ADMIN, SALES, PM, DEV',
            last_updated: '2020-10-06 16:13:58',
          },
        ],
        errors: [],
        success: true,
      }),
      ctx.delay(150),
    );
  }),
  rest.delete(`${checkApiUrl()}/api/projects/1/env/1`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: [],
        errors: [],
        success: true,
      }),
    );
  }),
];

const server = setupServer(...handlers);

// Enable API mocking before tests.
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done.
afterAll(() => server.close());

describe('Environment component', () => {
  it('should show spinner while render', async () => {
    renderWithData(
      <Routes>
        <Route path="/dashboard/projects/:id" element={<Environments />} />
      </Routes>,
      {
        route: '/dashboard/projects/1',
        component: <Environments />
      },
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('should show table with data after loading', async () => {
    renderWithData(
      <Routes>
        <Route path="/dashboard/projects/:id" element={<Environments />} />
      </Routes>,
      {
        route: '/dashboard/projects/1',
        component: <Environments />
      },
    );

    const table = await screen.findByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should show data in table', async () => {
    renderWithData(
      <Routes>
        <Route path="/dashboard/projects/:id" element={<Environments />} />
      </Routes>,
      {
        route: '/dashboard/projects/1',
        component: <Environments />
      },
    );

    const tableRow = await screen.findByText('React');
    expect(tableRow).toBeInTheDocument();
  });

  it('should show Edit Popup after click on Edit Icon', async () => {
    const user = userEvent.setup()

    renderWithData(
      <Routes>
        <Route path="/dashboard/projects/:id" element={<Environments />} />
      </Routes>,
      {
        route: '/dashboard/projects/1',
        component: <Environments />
      },
    );

    const buttons = await screen.findAllByTestId('edit-button');
    expect(buttons[0]).toBeInTheDocument();

    await user.click(buttons[0]);
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('should delete record in Table after confirmation in Delete Popup', async () => {
    const user = userEvent.setup();

    renderWithData(
      <Routes>
        <Route path="/dashboard/projects/:id" element={<Environments />} />
      </Routes>,
      {
        route: '/dashboard/projects/1',
        component: <Environments />
      },
    );

    const buttons = await screen.findAllByTestId('delete-button');
    expect(buttons[0]).toBeInTheDocument();

    await user.click(buttons[0]);
    expect(
      screen.getByText('Are you sure you want to delete it?'),
    ).toBeInTheDocument();

    const confirmDeleteButton = screen.getByTestId('confirm-delete');
    expect(confirmDeleteButton).toBeInTheDocument();

    userEvent.click(confirmDeleteButton);

    expect(await screen.findByText('Deleted')).toBeInTheDocument();
  });
});
