import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';

import { checkApiUrl } from '../../../../../../utils/helpers';
import renderWithData from '../../../../../../test-utils';

import Variables from './Variables';
import { createMemoryHistory } from 'history';
import Environments from '../Environments';

const handlers = [
  rest.get(`${checkApiUrl()}/api/projects/1/env/master`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: [
          {
            id: null,
            project_environment_id: 1,
            name: 'PROJECT_CON_NAME',
            value: 'new-test-project',
          },
          {
            id: 2,
            project_environment_id: 2,
            name: 'Var1',
            value: 'http_test',
          },
          {
            id: 3,
            project_environment_id: 2,
            name: 'Var2',
            value: 'http_test',
          },
          {
            shared_variables: [
              {
                id: 4,
                project_environment_id: 4,
                name: 'Var3 shared',
                value: 'http_test',
                shared_from_project_id: 2,
              },
              {
                id: 5,
                project_environment_id: 4,
                name: 'Var4 shared',
                value: 'http_test',
                shared_from_project_id: 2,
              },
            ],
          },
        ],
        errors: [],
        success: true,
      }),
    );
  }),
  rest.get(`${checkApiUrl()}/api/projects`, (req, res, ctx) => {
    return res(
      ctx.json({
        data: {
          projects: [
            {
              id: 2,
              name: 'New test project',
              type: 'FIXED_PRICE',
              jira: 'M3EET',
              status: 'INPROGRESS',
              is_internal: 0,
              is_sales: null,
              is_pm: null,
              total_logged: 1232,
              cost: '$3.100,\t55',
              total_paid: 1000,
              is_subscribed: false,
              total_approved: 0,
              date_start: '30/08/2019',
              date_end: 'Date End Not Set',
              developers: [
                { id: 6, first_name: 'Gary', last_name: 'Madison', role: 'PM' },
              ],
              clients: [],
              milestones: [
                {
                  id: 1,
                  name: 'test milestone',
                  start_date: '05/07/2019',
                  end_date: '16/07/2019',
                  closed_date: '30/08/2019',
                  estimated_amount: 5,
                  status: 'NEW',
                },
                {
                  id: 2,
                  name: 'test milestone2',
                  start_date: '01/02/2018',
                  end_date: '28/02/2018',
                  closed_date: '28/02/2018',
                  estimated_amount: 5,
                  status: 'CLOSED',
                },
              ],
            },
          ],
          total_records: '1',
        },
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

describe('Variables component', () => {
  it('should show tables', async () => {
    renderWithData(
      <Routes>
        <Route path="/dashboard/projects/:id/environments/:env_id/variables" element={<Variables />} />
      </Routes>,
      {
        route: '/dashboard/projects/1/environments/master/variables',
        component: <Variables />
      },
    );

    const tables = await screen.findAllByRole('table');
    // General table
    expect(tables[0]).toBeInTheDocument();
    // Shared table
    expect(tables[1]).toBeInTheDocument();
  });

  it('tables should have vars', async () => {
    renderWithData(
      <Routes>
        <Route path="/dashboard/projects/:id/environments/:env_id/variables" element={<Variables />} />
      </Routes>,
      {
        route: '/dashboard/projects/1/environments/master/variables',
        component: <Variables />
      },
    );

    const var1 = await screen.findByText('Var1');
    const var2 = await screen.findByText('Var3 shared');

    // simple variable
    expect(var1).toBeInTheDocument();
    // shared variable
    expect(var2).toBeInTheDocument();
  });

  it('should open edit popup', async () => {
    const user = userEvent.setup();

    renderWithData(
      <Routes>
        <Route path="/dashboard/projects/:id/environments/:env_id/variables" element={<Variables />} />
      </Routes>,
      {
        route: '/dashboard/projects/1/environments/master/variables',
        component: <Variables />
      },
    );

    const buttons = await screen.findAllByTestId('edit-button');
    expect(buttons[0]).toBeInTheDocument();

    await user.click(buttons[0]);
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('should open share screen', async () => {
    const user = userEvent.setup();

    renderWithData(
      <Routes>
        <Route path="/dashboard/projects/:id/environments/:env_id/variables" element={<Variables />} />
      </Routes>,
      {
        route: '/dashboard/projects/1/environments/master/variables',
        component: <Variables />
      },
    );

    const buttons = await screen.findAllByTestId('share-button');
    expect(buttons[0]).toBeInTheDocument();

    await act(async () => await user.click(buttons[0]));

    expect(await screen.findByText('Select PROJECTS')).toBeInTheDocument();
  });
});
