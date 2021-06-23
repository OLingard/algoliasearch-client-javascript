import { createNullCache } from '@algolia/cache-common';
import { createInMemoryCache } from '@algolia/cache-in-memory';
import { destroy, version } from '@algolia/client-common';
import { createNullLogger } from '@algolia/logger-common';
import { Destroyable } from '@algolia/requester-common';
import { createNodeHttpRequester } from '@algolia/requester-node-http';
import { createUserAgent } from '@algolia/transporter';

import { createRecommendClient } from '../createRecommendClient';
import { getFrequentlyBoughtTogether, getRecommendations, getRelatedProducts } from '../methods';
import {
  RecommendClient as BaseRecommendClient,
  RecommendOptions,
  WithRecommendMethods,
} from '../types';

export default function recommend(
  appId: string,
  apiKey: string,
  options?: RecommendOptions
): WithRecommendMethods<RecommendClient> {
  const commonOptions = {
    appId,
    apiKey,
    timeouts: {
      connect: 2,
      read: 5,
      write: 30,
    },
    requester: createNodeHttpRequester(),
    logger: createNullLogger(),
    responsesCache: createNullCache(),
    requestsCache: createNullCache(),
    hostsCache: createInMemoryCache(),
    userAgent: createUserAgent(version)
      .add({ segment: 'Recommend', version })
      .add({ segment: 'Node.js', version: process.versions.node }),
  };

  return createRecommendClient({
    ...commonOptions,
    ...options,
    methods: {
      destroy,
      getFrequentlyBoughtTogether,
      getRecommendations,
      getRelatedProducts,
    },
  });
}

// eslint-disable-next-line functional/immutable-data
recommend.version = version;

export type RecommendClient = BaseRecommendClient & Destroyable;

export * from '../types';